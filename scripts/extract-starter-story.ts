import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { TranscriptChunk } from './chunk-transcript'

type Video = {
  index: number
  id: string
  externalId: string
  title: string
  url: string
  transcriptStatus: 'available' | 'unavailable'
  chunkPath?: string
  metadata: { description?: string; tags: string[]; categories: string[] }
}

type Manifest = { videos: Video[] }

export type StarterStoryIdea = {
  title: string
  oneLiner: string
  summary: string
  problem: string
  targetCustomer: string
  solution: string
  businessModels: string[]
  industries: string[]
  skillsRequired: string[]
  distributionChannels: string[]
  capitalRequired: 'none' | 'low' | 'medium' | 'high'
  difficulty: 'low' | 'medium' | 'high'
  timeToRevenue: 'days' | 'weeks' | 'months' | 'years'
  soloFounderFit: number
  aiLeverage: number
  b2bFit: number
  boringBusinessScore: number
  competitionLevel: 'low' | 'medium' | 'high'
  geography: string
  monetization: string
  sourceConfidence: number
  evidenceChunkId: string
  quote: string
}

type Extraction = { ideas: StarterStoryIdea[] }

const outDir = '.private/extractions/starter-story'
const model = process.env.OPENAI_MODEL ?? 'gpt-5-mini'

export async function extractStarterStoryIdeas(options: { videoId?: string } = {}) {
  const apiKey = readEnv('OPENAI_API_KEY')
  const manifest = readJson<Manifest>('.private/imports/starter-story-youtube.json')
  const videos = manifest.videos.filter(
    (video) =>
      video.transcriptStatus === 'available' &&
      video.chunkPath &&
      (!options.videoId || video.externalId === options.videoId),
  )
  mkdirSync(outDir, { recursive: true })

  for (const [position, video] of videos.entries()) {
    const outPath = join(outDir, `${video.externalId}.json`)
    if (existsSync(outPath)) continue

    const chunks = readJson<TranscriptChunk[]>(video.chunkPath!)
    const extraction = await extractVideo(apiKey, video, chunks)
    writeFileSync(outPath, JSON.stringify({ video, ideas: extraction.ideas }, null, 2))
    console.log(`Extracted ${position + 1}/${videos.length}: ${video.externalId} (${extraction.ideas.length} ideas)`)
  }

  const all = manifest.videos.flatMap((video) => {
    const path = join(outDir, `${video.externalId}.json`)
    return existsSync(path) ? readJson<{ video: Video; ideas: StarterStoryIdea[] }>(path).ideas.map((idea) => ({ ...idea, video })) : []
  })
  writeFileSync(join(outDir, 'starter-story-extracted-ideas.json'), JSON.stringify(all, null, 2))
  return all
}

async function extractVideo(apiKey: string, video: Video, chunks: TranscriptChunk[]): Promise<Extraction> {
  const selected = chunks.filter(isCandidateChunk)
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content:
            'Extract concrete, buildable business ideas explicitly supported by this Starter Story video. A founder case study may yield the demonstrated business model or a narrower replicable wedge. Do not invent opportunities, metrics, customers, or quotes. Reject biography and generic advice. Return at most 4 distinct ideas. Evidence quote must be under 18 words and copied from one supplied chunk. Scores are integers 1-10.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            title: video.title,
            url: video.url,
            description: video.metadata.description,
            tags: video.metadata.tags,
            chunks: selected.map(({ id, startSec, endSec, text }) => ({ id, startSec, endSec, text })),
          }),
        },
      ],
      text: { format: extractionFormat },
    }),
  })
  if (!response.ok) throw new Error(`OpenAI extraction failed for ${video.externalId}: ${response.status} ${await response.text()}`)
  const payload = (await response.json()) as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> }
  const text = payload.output_text ?? payload.output?.flatMap((item) => item.content ?? []).find((item) => item.text)?.text
  if (!text) throw new Error(`OpenAI extraction returned no text for ${video.externalId}`)
  return JSON.parse(text) as Extraction
}

const stringArray = { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 5 }
const score = { type: 'integer', minimum: 1, maximum: 10 }
const extractionFormat = {
  type: 'json_schema',
  name: 'starter_story_business_ideas',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['ideas'],
    properties: {
      ideas: {
        type: 'array',
        maxItems: 4,
        items: {
          type: 'object',
          additionalProperties: false,
          required: [
            'title', 'oneLiner', 'summary', 'problem', 'targetCustomer', 'solution', 'businessModels', 'industries',
            'skillsRequired', 'distributionChannels', 'capitalRequired', 'difficulty', 'timeToRevenue',
            'soloFounderFit', 'aiLeverage', 'b2bFit', 'boringBusinessScore', 'competitionLevel', 'geography',
            'monetization', 'sourceConfidence', 'evidenceChunkId', 'quote',
          ],
          properties: {
            title: { type: 'string' }, oneLiner: { type: 'string' }, summary: { type: 'string' },
            problem: { type: 'string' }, targetCustomer: { type: 'string' }, solution: { type: 'string' },
            businessModels: stringArray, industries: stringArray, skillsRequired: stringArray,
            distributionChannels: stringArray,
            capitalRequired: { type: 'string', enum: ['none', 'low', 'medium', 'high'] },
            difficulty: { type: 'string', enum: ['low', 'medium', 'high'] },
            timeToRevenue: { type: 'string', enum: ['days', 'weeks', 'months', 'years'] },
            soloFounderFit: score, aiLeverage: score, b2bFit: score, boringBusinessScore: score,
            competitionLevel: { type: 'string', enum: ['low', 'medium', 'high'] },
            geography: { type: 'string' }, monetization: { type: 'string' },
            sourceConfidence: { type: 'number', minimum: 0, maximum: 1 },
            evidenceChunkId: { type: 'string' }, quote: { type: 'string' },
          },
        },
      },
    },
  },
}

function isCandidateChunk(chunk: TranscriptChunk) {
  const text = chunk.text.toLowerCase()
  return ['revenue', 'customer', 'business', 'startup', 'product', 'service', 'sell', 'market', 'profit', 'subscription']
    .filter((signal) => text.includes(signal)).length >= 2
}

function readEnv(key: string) {
  if (process.env[key]) return process.env[key]!
  const vars = Object.fromEntries(readFileSync('.dev.vars', 'utf8').split(/\n/).map((line) => line.match(/^([^=#]+)=(.*)$/)).filter((match): match is RegExpMatchArray => Boolean(match)).map((match) => [match[1], match[2]]))
  if (!vars[key]) throw new Error(`Missing ${key}`)
  return vars[key]
}

function readJson<T>(path: string) {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const videoId = process.argv.includes('--video') ? process.argv[process.argv.indexOf('--video') + 1] : undefined
  extractStarterStoryIdeas({ videoId }).then((ideas) => console.log(`Extracted ${ideas.length} Starter Story ideas`)).catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
