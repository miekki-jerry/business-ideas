import { readFileSync, writeFileSync } from 'node:fs'
import type { TranscriptChunk } from './chunk-transcript'
import type { StarterStoryIdea } from './extract-starter-story'

type Video = {
  id: string
  externalId: string
  title: string
  url: string
  publishedAt?: string
  durationSec?: number
  language: string
  transcriptStatus: 'available' | 'unavailable'
  chunkPath?: string
  metadata: Record<string, unknown>
}

type ReviewedIdea = StarterStoryIdea & {
  video: Video
  review: { decision: 'accept' | 'reject'; reason: string; publicQuality: number }
}

type CuratedImport = {
  sources: Array<Record<string, unknown> & { id: string; items?: Array<Record<string, unknown>> }>
  ideas: Array<Record<string, unknown> & { evidence: Array<Record<string, unknown> & { sourceId?: string }> }>
}

const sourceId = 'source_starter_story_youtube'

export function buildStarterStoryImport() {
  const manifest = readJson<{ source: Record<string, unknown> & { id: string }; videos: Video[] }>(
    '.private/imports/starter-story-youtube.json',
  )
  const reviewed = readJson<ReviewedIdea[]>('.private/extractions/starter-story/starter-story-reviewed-ideas.json')
  const curated = readJson<CuratedImport>('.private/imports/curated-source-ideas.json')

  curated.sources = curated.sources.filter((source) => source.id !== sourceId)
  curated.ideas = curated.ideas.filter((idea) => !idea.evidence.some((evidence) => evidence.sourceId === sourceId))
  curated.sources.push({
    ...manifest.source,
    items: manifest.videos.map((video) => ({
      id: video.id,
      title: video.title,
      url: video.url,
      externalId: video.externalId,
      publishedAt: video.publishedAt,
      durationSec: video.durationSec,
      language: video.language,
      transcriptStatus: video.transcriptStatus,
      rawMetadata: video.metadata,
    })),
  })

  const accepted = reviewed.filter(
    (idea) => idea.review.decision === 'accept' && idea.review.publicQuality >= 0.75 && idea.sourceConfidence >= 0.7,
  )
  for (const idea of accepted) {
    const chunk = findChunk(idea.video, idea.evidenceChunkId)
    curated.ideas.push({
      title: idea.title,
      oneLiner: idea.oneLiner,
      summary: idea.summary,
      problem: idea.problem,
      targetCustomer: idea.targetCustomer,
      solution: idea.solution,
      businessModels: idea.businessModels,
      industries: idea.industries,
      skillsRequired: idea.skillsRequired,
      distributionChannels: idea.distributionChannels,
      capitalRequired: idea.capitalRequired,
      difficulty: idea.difficulty,
      timeToRevenue: idea.timeToRevenue,
      soloFounderFit: idea.soloFounderFit,
      aiLeverage: idea.aiLeverage,
      b2bFit: idea.b2bFit,
      boringBusinessScore: idea.boringBusinessScore,
      competitionLevel: idea.competitionLevel,
      geography: idea.geography,
      monetization: idea.monetization,
      sourceConfidence: idea.sourceConfidence,
      evidence: [{
        sourceId,
        sourceItemId: idea.video.id,
        sourceTitle: idea.video.title,
        sourceType: 'youtube',
        sourceUrl: idea.video.url,
        chunkId: chunk?.id,
        startSec: chunk?.startSec,
        endSec: chunk?.endSec,
        urlAtTimestamp: chunk?.urlAtTimestamp ?? idea.video.url,
        quote: idea.quote,
        reason: `Accepted from a Starter Story transcript with ${Math.round(idea.review.publicQuality * 100)}% review quality.`,
        relevanceScore: idea.sourceConfidence,
      }],
    })
  }

  writeFileSync('.private/imports/curated-source-ideas.json', JSON.stringify(curated, null, 2))
  return { videos: manifest.videos.length, transcripts: manifest.videos.filter((video) => video.transcriptStatus === 'available').length, acceptedIdeas: accepted.length }
}

function findChunk(video: Video, id: string) {
  if (!video.chunkPath) return undefined
  return readJson<TranscriptChunk[]>(video.chunkPath).find((chunk) => chunk.id === id)
}

function readJson<T>(path: string) {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = buildStarterStoryImport()
  console.log(`Built Starter Story import: ${result.videos} videos, ${result.transcripts} transcripts, ${result.acceptedIdeas} accepted ideas`)
}
