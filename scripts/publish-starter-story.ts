import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import type { BusinessIdea, Source, SourceItem } from '@/features/business-ideas/types'

const sourceId = 'source_starter_story_youtube'

export function prepareStarterStoryPublish() {
  const sources = readJson<Source[]>('.private/r2/sources.json')
  const sourceItems = readJson<SourceItem[]>('.private/r2/source-items.json').filter((item) => item.sourceId === sourceId)
  const source = sources.find((item) => item.id === sourceId)
  if (!source) throw new Error(`Missing ${sourceId} in built catalog`)

  const ideas = readdirSync('.private/r2/ideas')
    .filter((file) => file.endsWith('.json'))
    .map((file) => readJson<BusinessIdea>(`.private/r2/ideas/${file}`))
    .filter((idea) => idea.evidence.some((evidence) => evidence.sourceId === sourceId))

  const lines = [
    `insert or replace into sources (id, type, name, url, author, description, created_at, updated_at) values (${q(source.id)}, ${q(source.type)}, ${q(source.name)}, ${q(source.url)}, ${q(source.author)}, ${q(source.description)}, ${q(source.createdAt)}, ${q(source.updatedAt)});`,
  ]
  for (const item of sourceItems) {
    lines.push(
      `insert or replace into source_items (id, source_id, title, url, external_id, published_at, duration_sec, language, r2_key, raw_metadata_json, created_at, updated_at) values (${q(item.id)}, ${q(item.sourceId)}, ${q(item.title)}, ${q(item.url)}, ${q(item.externalId)}, ${q(item.publishedAt)}, ${n(item.durationSec)}, ${q(item.language)}, ${q(item.r2Key)}, ${q(JSON.stringify({ ...item.rawMetadata, transcriptStatus: item.transcriptStatus }))}, ${q(item.createdAt)}, ${q(item.updatedAt)});`,
    )
  }
  lines.push(`delete from idea_evidence where source_id = ${q(sourceId)};`)
  for (const idea of ideas) {
    lines.push(
      `insert or replace into business_ideas (id, slug, title, one_liner, primary_industry, primary_business_model, capital_required, difficulty, time_to_revenue, solo_founder_fit, ai_leverage, b2b_fit, boring_business_score, competition_level, geography, r2_json_key, r2_markdown_key, source_confidence, created_at, updated_at) values (${q(idea.id)}, ${q(idea.slug)}, ${q(idea.title)}, ${q(idea.oneLiner)}, ${q(idea.industries[0])}, ${q(idea.businessModels[0])}, ${q(idea.capitalRequired)}, ${q(idea.difficulty)}, ${q(idea.timeToRevenue)}, ${n(idea.soloFounderFit)}, ${n(idea.aiLeverage)}, ${n(idea.b2bFit)}, ${n(idea.boringBusinessScore)}, ${q(idea.competitionLevel)}, ${q(idea.geography)}, ${q(`ideas/${idea.id}.json`)}, ${q(`ideas/${idea.id}.md`)}, ${n(idea.sourceConfidence)}, ${q(idea.createdAt)}, ${q(idea.updatedAt)});`,
    )
    for (const evidence of idea.evidence.filter((item) => item.sourceId === sourceId)) {
      lines.push(
        `insert or replace into idea_evidence (id, idea_id, source_id, source_item_id, chunk_id, source_title, source_url, start_sec, end_sec, url_at_timestamp, quote, relevance_score, r2_chunk_key, created_at) values (${q(evidence.id)}, ${q(evidence.ideaId)}, ${q(evidence.sourceId)}, ${q(evidence.sourceItemId)}, ${q(evidence.chunkId)}, ${q(evidence.sourceTitle)}, ${q(evidence.sourceUrl)}, ${n(evidence.startSec)}, ${n(evidence.endSec)}, ${q(evidence.urlAtTimestamp)}, ${q(evidence.quote)}, ${n(evidence.relevanceScore)}, null, ${q(idea.createdAt)});`,
      )
    }
  }

  mkdirSync('.private/publish/starter-story', { recursive: true })
  writeFileSync('.private/publish/starter-story/upsert.sql', lines.join('\n'))
  writeFileSync(
    '.private/publish/starter-story/idea-ids.txt',
    ideas.map((idea) => idea.id).sort().join('\n'),
  )
  return { sourceItems: sourceItems.length, ideas: ideas.length }
}

function readJson<T>(path: string) {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

const q = (value: unknown) => (value === undefined || value === null ? 'null' : `'${String(value).replaceAll("'", "''")}'`)
const n = (value: unknown) => (value === undefined || value === null ? 'null' : String(value))

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = prepareStarterStoryPublish()
  console.log(`Prepared incremental publish: ${result.sourceItems} source items, ${result.ideas} ideas`)
}
