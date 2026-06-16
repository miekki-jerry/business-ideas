import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

type MfmExtractedIdea = {
  title: string
  oneLiner: string
  summary: string
  quote: string
  confidence: number
  episodeIndex: number
  sourceItemId?: string
  chunkId?: string
}

type ReviewDecision = {
  id: string
  decision: 'accept' | 'reject'
  reason: string
  publicQuality: number
}

type ReviewResponse = {
  decisions: ReviewDecision[]
}

const inputPath = '.private/extractions/mfm/mfm-extracted-ideas.json'
const outDir = '.private/extractions/mfm'
const outPath = join(outDir, 'mfm-reviewed-ideas.json')
const model = process.env.OPENAI_MODEL ?? 'gpt-5-mini'

export async function reviewMfmIdeas() {
  const apiKey = readEnv('OPENAI_API_KEY')
  const ideas = readJson<MfmExtractedIdea[]>(inputPath).map((idea, index) => ({
    ...idea,
    reviewId: `mfm_candidate_${String(index + 1).padStart(3, '0')}`,
  }))
  const batches = chunk(ideas, 35)
  const decisions = new Map<string, ReviewDecision>()

  mkdirSync(outDir, { recursive: true })

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index]
    const review = await reviewBatch(apiKey, batch)
    for (const decision of review.decisions) {
      decisions.set(decision.id, decision)
    }
    console.log(`Reviewed batch ${index + 1}/${batches.length}`)
  }

  const reviewed = ideas.map((idea) => ({
    ...idea,
    review: decisions.get(idea.reviewId) ?? {
      id: idea.reviewId,
      decision: 'reject' as const,
      reason: 'Missing review decision.',
      publicQuality: 0,
    },
  }))

  writeFileSync(outPath, JSON.stringify(reviewed, null, 2))
  return reviewed
}

async function reviewBatch(apiKey: string, batch: Array<MfmExtractedIdea & { reviewId: string }>): Promise<ReviewResponse> {
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
            'Review extracted My First Million business idea candidates for a public knowledge base. Accept only concrete, source-backed, buildable business/app ideas useful to an indie builder or small team. Reject investing advice, biography, generic strategy, examples of giant existing companies without a smaller wedge, and vague observations. Prefer fewer high-quality cards over broad coverage.',
        },
        {
          role: 'user',
          content: JSON.stringify(
            batch.map((idea) => ({
              id: idea.reviewId,
              episodeIndex: idea.episodeIndex,
              title: idea.title,
              oneLiner: idea.oneLiner,
              summary: idea.summary,
              quote: idea.quote,
              extractionConfidence: idea.confidence,
            })),
          ),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'mfm_business_idea_review',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['decisions'],
            properties: {
              decisions: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['id', 'decision', 'reason', 'publicQuality'],
                  properties: {
                    id: { type: 'string' },
                    decision: { type: 'string', enum: ['accept', 'reject'] },
                    reason: { type: 'string' },
                    publicQuality: { type: 'number', minimum: 0, maximum: 1 },
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
    throw new Error(`OpenAI review failed: ${response.status} ${error}`)
  }

  const payload = (await response.json()) as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> }
  const text = payload.output_text ?? payload.output?.flatMap((item) => item.content ?? []).find((item) => item.text)?.text
  if (!text) {
    throw new Error('OpenAI review returned no text')
  }

  return JSON.parse(text) as ReviewResponse
}

function readJson<T>(path: string) {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

function readEnv(key: string) {
  const fromProcess = process.env[key]
  if (fromProcess) {
    return fromProcess
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

function chunk<T>(values: T[], size: number) {
  const chunks: T[][] = []
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size))
  }
  return chunks
}

if (import.meta.url === `file://${process.argv[1]}`) {
  reviewMfmIdeas()
    .then((ideas) => {
      const accepted = ideas.filter((idea) => idea.review.decision === 'accept').length
      console.log(`Reviewed ${ideas.length} MFM ideas; accepted ${accepted}`)
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
