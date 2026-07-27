import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import type { StarterStoryIdea } from './extract-starter-story'

type Candidate = StarterStoryIdea & {
  video: { externalId: string; title: string; url: string }
  reviewId: string
}

type Decision = { id: string; decision: 'accept' | 'reject'; reason: string; publicQuality: number }
type ReviewResponse = { decisions: Decision[] }

const model = process.env.OPENAI_MODEL ?? 'gpt-5-mini'

export async function reviewStarterStoryIdeas(options: { batchIndex?: number } = {}) {
  const apiKey = readEnv('OPENAI_API_KEY')
  const ideas = readJson<Array<StarterStoryIdea & { video: Candidate['video'] }>>(
    '.private/extractions/starter-story/starter-story-extracted-ideas.json',
  ).map((idea, index) => ({ ...idea, reviewId: `starter_story_candidate_${String(index + 1).padStart(4, '0')}` }))
  const decisions = new Map<string, Decision>()
  const reviewDir = '.private/extractions/starter-story/reviews'
  mkdirSync(reviewDir, { recursive: true })
  const batches = chunk(ideas, 30)

  for (const [index, batch] of batches.entries()) {
    if (options.batchIndex !== undefined && options.batchIndex !== index) continue
    const cachePath = `${reviewDir}/batch-${String(index).padStart(3, '0')}.json`
    const review = existsSync(cachePath) ? readJson<ReviewResponse>(cachePath) : await reviewBatch(apiKey, batch)
    if (!existsSync(cachePath)) writeFileSync(cachePath, JSON.stringify(review, null, 2))
    for (const decision of review.decisions) decisions.set(decision.id, decision)
    console.log(`Reviewed batch ${index + 1}/${batches.length}`)
  }

  if (options.batchIndex !== undefined) {
    return ideas
  }

  for (const index of batches.keys()) {
    const cachePath = `${reviewDir}/batch-${String(index).padStart(3, '0')}.json`
    if (!existsSync(cachePath)) throw new Error(`Missing review batch ${index + 1}/${batches.length}`)
    for (const decision of readJson<ReviewResponse>(cachePath).decisions) decisions.set(decision.id, decision)
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
  writeFileSync('.private/extractions/starter-story/starter-story-reviewed-ideas.json', JSON.stringify(reviewed, null, 2))
  return reviewed
}

async function reviewBatch(apiKey: string, batch: Candidate[]): Promise<ReviewResponse> {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content:
            'Review Starter Story extractions for a public business-idea knowledge base. Accept only concrete, source-backed, buildable ideas with a clear customer, solution, and monetization. Reject biography, generic advice, vague categories, non-replicable celebrity businesses, invented claims, and duplicates inside the batch. Prefer fewer strong cards.',
        },
        {
          role: 'user',
          content: JSON.stringify(batch.map((idea) => ({
            id: idea.reviewId,
            video: idea.video.title,
            title: idea.title,
            oneLiner: idea.oneLiner,
            summary: idea.summary,
            problem: idea.problem,
            targetCustomer: idea.targetCustomer,
            quote: idea.quote,
            confidence: idea.sourceConfidence,
          }))),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'starter_story_review',
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
  if (!response.ok) throw new Error(`OpenAI review failed: ${response.status} ${await response.text()}`)
  const payload = (await response.json()) as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> }
  const text = payload.output_text ?? payload.output?.flatMap((item) => item.content ?? []).find((item) => item.text)?.text
  if (!text) throw new Error('OpenAI review returned no text')
  return JSON.parse(text) as ReviewResponse
}

function chunk<T>(values: T[], size: number) {
  return Array.from({ length: Math.ceil(values.length / size) }, (_, index) => values.slice(index * size, (index + 1) * size))
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
  const batchIndex = process.argv.includes('--batch') ? Number(process.argv[process.argv.indexOf('--batch') + 1]) : undefined
  reviewStarterStoryIdeas({ batchIndex }).then((ideas) => {
    if (batchIndex !== undefined) {
      console.log(`Cached review batch ${batchIndex}`)
      return
    }
    const reviewed = ideas as Array<Candidate & { review: Decision }>
    console.log(`Reviewed ${reviewed.length}; accepted ${reviewed.filter((idea) => idea.review.decision === 'accept').length}`)
  }).catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
