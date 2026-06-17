import { describe, expect, it } from 'vitest'
import type { BusinessIdea } from '../src/features/business-ideas/types'
import { createIdeasRepository } from '../src/services/repository'

describe('D1/R2 ideas repository', () => {
  it('lists every idea without capping at the old 250 record threshold', async () => {
    const ideas = Array.from({ length: 256 }, (_, index) => makeIdea(index + 1))
    const db = {
      prepare: () => ({
        all: async () => ({
          results: ideas.map((idea) => ({
            id: idea.id,
            r2_json_key: `ideas/${idea.id}.json`,
          })),
        }),
      }),
    }
    const bucket = {
      get: async (key: string) => ({
        json: async () => ideas.find((idea) => key === `ideas/${idea.id}.json`),
      }),
    }

    const repository = createIdeasRepository({
      BUSINESS_IDEAS_DB: db as unknown as D1Database,
      BUSINESS_IDEAS_BUCKET: bucket as unknown as R2Bucket,
    })

    await expect(repository.listIdeas()).resolves.toHaveLength(256)
  })
})

function makeIdea(index: number): BusinessIdea {
  const slug = `idea-${index}`

  return {
    id: `idea_${index}`,
    slug,
    title: `Idea ${index}`,
    oneLiner: `Idea ${index} one liner`,
    summary: `Idea ${index} summary`,
    businessModels: ['saas'],
    industries: ['software'],
    skillsRequired: ['software'],
    distributionChannels: ['SEO'],
    capitalRequired: 'low',
    difficulty: 'medium',
    timeToRevenue: 'months',
    soloFounderFit: 8,
    aiLeverage: 5,
    b2bFit: 8,
    boringBusinessScore: 7,
    sourceConfidence: 0.8,
    evidence: [
      {
        id: `evidence_${slug}_001`,
        ideaId: `idea_${index}`,
        sourceTitle: 'Test Source',
        sourceUrl: 'https://example.com',
      },
    ],
    createdAt: '2026-06-17T00:00:00.000Z',
    updatedAt: '2026-06-17T00:00:00.000Z',
  }
}
