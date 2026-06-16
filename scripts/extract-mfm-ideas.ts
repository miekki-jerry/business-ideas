import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import type { TranscriptChunk } from './chunk-transcript'

type PreparedTranscript = {
  index: number
  title: string
  pageUrl: string
  youtubeId?: string
  youtubeUrl?: string
  youtubeTitle?: string
  sourceItemId?: string
  transcriptStatus: 'available' | 'unavailable'
  chunkPath?: string
}

type ExtractedIdea = {
  title: string
  oneLiner: string
  summary: string
  problem?: string
  targetCustomer?: string
  solution?: string
  businessModels: string[]
  industries: string[]
  capitalRequired: 'none' | 'low' | 'medium' | 'high'
  difficulty: 'low' | 'medium' | 'high'
  timeToRevenue: 'days' | 'weeks' | 'months' | 'years'
  quote: string
  confidence: number
}

type ChunkExtraction = {
  hasBusinessIdeas: boolean
  ideas: ExtractedIdea[]
}

const outDir = '.private/extractions/mfm'
const model = process.env.OPENAI_MODEL ?? 'gpt-5-mini'

export async function extractMfmIdeas(options: { episodeIndex?: number; maxChunks?: number } = {}) {
  const apiKey = readEnv('OPENAI_API_KEY')
  const prepared = readJson<PreparedTranscript[]>('.private/transcripts/mfm/prepared-transcripts.json')
  const transcripts = prepared.filter((item) => item.transcriptStatus === 'available' && item.chunkPath)
  const selected = options.episodeIndex ? transcripts.filter((item) => item.index === options.episodeIndex) : transcripts
  mkdirSync(outDir, { recursive: true })

  const allIdeas = []

  for (const transcript of selected) {
    const chunks = readJson<TranscriptChunk[]>(transcript.chunkPath!)
    const candidateChunks = chunks.filter(isCandidateChunk)
    const limitedChunks = options.maxChunks ? candidateChunks.slice(0, options.maxChunks) : candidateChunks
    const outPath = join(outDir, `${basename(transcript.sourceItemId ?? `episode-${transcript.index}`)}.json`)
    const chunkResults = exists(outPath) ? readJson<Array<{ chunk: TranscriptChunk; extraction: ChunkExtraction }>>(outPath) : []
    const limitedChunkIds = new Set(limitedChunks.map((chunk) => chunk.id))
    const completedChunkIds = new Set(chunkResults.map((result) => result.chunk.id).filter((chunkId) => limitedChunkIds.has(chunkId)))

    for (const chunk of limitedChunks) {
      let existing = chunkResults.find((result) => result.chunk.id === chunk.id)

      if (!existing) {
        const extraction = await extractChunkWithRetry(apiKey, transcript, chunk)
        existing = { chunk, extraction }
        chunkResults.push(existing)
        writeFileSync(outPath, JSON.stringify(chunkResults, null, 2))
        completedChunkIds.add(chunk.id)
        console.log(`Extracted ${completedChunkIds.size}/${limitedChunks.length} chunks for episode ${transcript.index}`)
      }

      for (const idea of existing.extraction.ideas) {
        allIdeas.push({
          ...idea,
          sourceItemId: transcript.sourceItemId,
          sourceTitle: transcript.youtubeTitle ?? transcript.title,
          sourceUrl: transcript.youtubeUrl ?? transcript.pageUrl,
          sourcePageUrl: transcript.pageUrl,
          youtubeId: transcript.youtubeId,
          chunkId: chunk.id,
          startSec: chunk.startSec,
          endSec: chunk.endSec,
          urlAtTimestamp: chunk.urlAtTimestamp,
          episodeIndex: transcript.index,
        })
      }
    }

    writeFileSync(outPath, JSON.stringify(chunkResults, null, 2))
  }

  writeFileSync(join(outDir, 'mfm-extracted-ideas.json'), JSON.stringify(allIdeas, null, 2))
  return allIdeas
}

async function extractChunk(apiKey: string, transcript: PreparedTranscript, chunk: TranscriptChunk): Promise<ChunkExtraction> {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content:
            'Extract only concrete business or app ideas explicitly supported by the transcript chunk. If the chunk is investing advice, biography, banter, or general strategy without a concrete business/app idea, return hasBusinessIdeas=false and an empty ideas array. Keep quotes under 18 words.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            episodeTitle: transcript.title,
            sourceUrl: transcript.youtubeUrl ?? transcript.pageUrl,
            chunkId: chunk.id,
            startSec: chunk.startSec,
            endSec: chunk.endSec,
            text: chunk.text,
          }),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'business_idea_chunk_extraction',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['hasBusinessIdeas', 'ideas'],
            properties: {
              hasBusinessIdeas: { type: 'boolean' },
              ideas: {
                type: 'array',
                maxItems: 3,
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: [
                    'title',
                    'oneLiner',
                    'summary',
                    'problem',
                    'targetCustomer',
                    'solution',
                    'businessModels',
                    'industries',
                    'capitalRequired',
                    'difficulty',
                    'timeToRevenue',
                    'quote',
                    'confidence',
                  ],
                  properties: {
                    title: { type: 'string' },
                    oneLiner: { type: 'string' },
                    summary: { type: 'string' },
                    problem: { type: 'string' },
                    targetCustomer: { type: 'string' },
                    solution: { type: 'string' },
                    businessModels: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 4 },
                    industries: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 4 },
                    capitalRequired: { type: 'string', enum: ['none', 'low', 'medium', 'high'] },
                    difficulty: { type: 'string', enum: ['low', 'medium', 'high'] },
                    timeToRevenue: { type: 'string', enum: ['days', 'weeks', 'months', 'years'] },
                    quote: { type: 'string' },
                    confidence: { type: 'number', minimum: 0, maximum: 1 },
                  },
                },
              },
            },
          },
        },
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI extraction failed: ${response.status} ${error}`)
  }

  const payload = (await response.json()) as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> }
  const text = payload.output_text ?? payload.output?.flatMap((item) => item.content ?? []).find((item) => item.text)?.text
  if (!text) {
    throw new Error('OpenAI extraction returned no text')
  }

  return JSON.parse(text) as ChunkExtraction
}

async function extractChunkWithRetry(apiKey: string, transcript: PreparedTranscript, chunk: TranscriptChunk) {
  let lastError: unknown

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await extractChunk(apiKey, transcript, chunk)
    } catch (error) {
      lastError = error
      const delayMs = attempt * 1500
      console.warn(`Retrying chunk ${chunk.id} after attempt ${attempt}: ${error instanceof Error ? error.message : String(error)}`)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  throw lastError
}

function readJson<T>(path: string) {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

function readEnv(key: string) {
  const fromProcess = process.env[key]
  if (fromProcess) {
    return fromProcess
  }

  if (!exists('.dev.vars')) {
    throw new Error(`Missing ${key}`)
  }

  const vars = Object.fromEntries(
    readFileSync('.dev.vars', 'utf8')
      .split(/\n/)
      .map((line) => line.match(/^([^=#]+)=(.*)$/))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map((match) => [match[1], match[2]]),
  )

  if (!vars[key]) {
    throw new Error(`Missing ${key}`)
  }

  return vars[key]
}

function exists(path: string) {
  try {
    readFileSync(path)
    return true
  } catch {
    return false
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const episodeIndex = process.argv.includes('--episode')
    ? Number(process.argv[process.argv.indexOf('--episode') + 1])
    : undefined
  const maxChunks = process.argv.includes('--max-chunks')
    ? Number(process.argv[process.argv.indexOf('--max-chunks') + 1])
    : undefined

  if (process.argv.includes('--dry-run')) {
    const prepared = readJson<PreparedTranscript[]>('.private/transcripts/mfm/prepared-transcripts.json')
    for (const transcript of prepared.filter((item) => item.transcriptStatus === 'available' && item.chunkPath)) {
      const chunks = readJson<TranscriptChunk[]>(transcript.chunkPath!)
      console.log(`${transcript.index}: ${chunks.filter(isCandidateChunk).length}/${chunks.length} candidate chunks - ${transcript.title}`)
    }
    process.exit(0)
  }

  extractMfmIdeas({ episodeIndex, maxChunks })
    .then((ideas) => console.log(`Extracted ${ideas.length} MFM ideas`))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

function isCandidateChunk(chunk: TranscriptChunk) {
  const text = chunk.text.toLowerCase()
  const strongSignals = [
    'business idea',
    'startup idea',
    'app idea',
    'start a business',
    'company idea',
    'killer startup',
    'make money',
    'revenue',
    'customers',
    'marketplace',
    'saas',
    'software',
    'ai app',
    'ai agent',
    'opportunity',
  ]
  const weakSignals = ['business', 'startup', 'app', 'market', 'customer', 'sell', 'build', 'product', 'service', 'idea']

  if (strongSignals.some((signal) => text.includes(signal))) {
    return true
  }

  return weakSignals.filter((signal) => text.includes(signal)).length >= 3
}
