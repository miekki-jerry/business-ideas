import { sampleIdeas, sampleSourceItems, sampleSources } from '@/data/sample-data'
import type { BusinessIdea, IdeaEvidence, RepositoryHealth, Source, SourceItem } from '@/features/business-ideas/types'

export type Env = {
  BUSINESS_IDEAS_DB?: D1Database
  BUSINESS_IDEAS_BUCKET?: R2Bucket
  BUSINESS_IDEAS_SEARCH?: AISearchBinding
  ALLOWED_ORIGINS?: string
}

export type AISearchBinding = {
  search(input: {
    query?: string
    messages?: Array<{ role: 'user'; content: string }>
    max_num_results?: number
    filters?: Record<string, string | number | boolean | Array<string | number | boolean>>
    ai_search_options?: {
      retrieval?: {
        retrieval_type?: 'vector' | 'keyword' | 'hybrid'
        match_threshold?: number
        max_num_results?: number
        filters?: Record<string, unknown>
        fusion_method?: 'rrf' | 'max'
        keyword_match_mode?: 'and' | 'or'
      }
      reranking?: {
        enabled?: boolean
        model?: string
      }
    }
  }): Promise<{
    data?: Array<{
      filename?: string
      path?: string
      item?: { key?: string }
      score?: number
      metadata?: Record<string, unknown>
    }>
    chunks?: Array<{
      filename?: string
      path?: string
      item?: { key?: string }
      score?: number
      metadata?: Record<string, unknown>
    }>
    result?: {
      data?: Array<{
        filename?: string
        path?: string
        item?: { key?: string }
        score?: number
        metadata?: Record<string, unknown>
      }>
    }
  }>
}

export interface IdeasRepository {
  health(): Promise<RepositoryHealth>
  listIdeas(): Promise<BusinessIdea[]>
  getRandomIdea(): Promise<BusinessIdea | null>
  getIdeaById(id: string): Promise<BusinessIdea | null>
  getIdeaBySlug(slug: string): Promise<BusinessIdea | null>
  getEvidence(ideaId: string): Promise<IdeaEvidence[]>
  listSources(): Promise<Source[]>
  getSource(id: string): Promise<Source | null>
  listSourceItems(): Promise<SourceItem[]>
}

export function createIdeasRepository(env?: Env): IdeasRepository {
  if (env?.BUSINESS_IDEAS_DB && env.BUSINESS_IDEAS_BUCKET) {
    return new D1R2IdeasRepository(env.BUSINESS_IDEAS_DB, env.BUSINESS_IDEAS_BUCKET)
  }

  return new SampleIdeasRepository()
}

class SampleIdeasRepository implements IdeasRepository {
  async health(): Promise<RepositoryHealth> {
    return { storage: 'sample', ideaCount: sampleIdeas.length }
  }

  async listIdeas() {
    return sampleIdeas
  }

  async getRandomIdea() {
    return sampleIdeas[0] ?? null
  }

  async getIdeaById(id: string) {
    return sampleIdeas.find((idea) => idea.id === id) ?? null
  }

  async getIdeaBySlug(slug: string) {
    return sampleIdeas.find((idea) => idea.slug === slug) ?? null
  }

  async getEvidence(ideaId: string) {
    return sampleIdeas.find((idea) => idea.id === ideaId)?.evidence ?? []
  }

  async listSources() {
    return sampleSources
  }

  async getSource(id: string) {
    return sampleSources.find((source) => source.id === id) ?? null
  }

  async listSourceItems() {
    return sampleSourceItems
  }
}

class D1R2IdeasRepository implements IdeasRepository {
  private readonly fallback = new SampleIdeasRepository()

  constructor(
    private readonly db: D1Database,
    private readonly bucket: R2Bucket,
  ) {}

  async health(): Promise<RepositoryHealth> {
    const row = await this.db.prepare('select count(*) as count from business_ideas').first<{ count: number }>()
    const count = row?.count ?? 0

    if (count === 0) {
      return this.fallback.health()
    }

    return { storage: 'd1-r2', ideaCount: count }
  }

  async listIdeas() {
    const rows = await this.db
      .prepare('select id, r2_json_key from business_ideas order by created_at desc limit 250')
      .all<{ id: string; r2_json_key: string }>()

    const ideas = await Promise.all(rows.results.map((row) => this.getIdeaFromR2(row.r2_json_key)))
    const found = ideas.filter((idea): idea is BusinessIdea => Boolean(idea))
    return found.length > 0 ? found : this.fallback.listIdeas()
  }

  async getRandomIdea() {
    const row = await this.db
      .prepare('select r2_json_key from business_ideas order by random() limit 1')
      .first<{ r2_json_key: string }>()

    return row ? this.getIdeaFromR2(row.r2_json_key) : this.fallback.getRandomIdea()
  }

  async getIdeaById(id: string) {
    const row = await this.db
      .prepare('select r2_json_key from business_ideas where id = ? limit 1')
      .bind(id)
      .first<{ r2_json_key: string }>()

    return row ? this.getIdeaFromR2(row.r2_json_key) : this.fallback.getIdeaById(id)
  }

  async getIdeaBySlug(slug: string) {
    const row = await this.db
      .prepare('select r2_json_key from business_ideas where slug = ? limit 1')
      .bind(slug)
      .first<{ r2_json_key: string }>()

    return row ? this.getIdeaFromR2(row.r2_json_key) : this.fallback.getIdeaBySlug(slug)
  }

  async getEvidence(ideaId: string) {
    const rows = await this.db
      .prepare(
        `select id, idea_id, source_id, source_item_id, chunk_id, source_title, source_url, start_sec,
          end_sec, url_at_timestamp, quote, relevance_score
         from idea_evidence where idea_id = ? order by relevance_score desc`,
      )
      .bind(ideaId)
      .all<Record<string, unknown>>()

    const evidence = rows.results.map(mapEvidenceRow)
    return evidence.length > 0 ? evidence : this.fallback.getEvidence(ideaId)
  }

  async listSources() {
    const rows = await this.db.prepare('select * from sources order by name asc').all<Record<string, unknown>>()
    const sources = rows.results.map(mapSourceRow)
    return sources.length > 0 ? sources : this.fallback.listSources()
  }

  async getSource(id: string) {
    const row = await this.db.prepare('select * from sources where id = ?').bind(id).first<Record<string, unknown>>()
    return row ? mapSourceRow(row) : this.fallback.getSource(id)
  }

  async listSourceItems() {
    const rows = await this.db.prepare('select * from source_items order by published_at desc').all<Record<string, unknown>>()
    const sourceItems = rows.results.map(mapSourceItemRow)
    return sourceItems.length > 0 ? sourceItems : this.fallback.listSourceItems()
  }

  private async getIdeaFromR2(key: string) {
    const object = await this.bucket.get(key)
    if (!object) {
      return null
    }

    return object.json<BusinessIdea>()
  }
}

function mapEvidenceRow(row: Record<string, unknown>): IdeaEvidence {
  return {
    id: String(row.id),
    ideaId: String(row.idea_id),
    sourceId: optionalString(row.source_id),
    sourceItemId: optionalString(row.source_item_id),
    chunkId: optionalString(row.chunk_id),
    sourceTitle: String(row.source_title ?? ''),
    sourceUrl: String(row.source_url ?? ''),
    startSec: optionalNumber(row.start_sec),
    endSec: optionalNumber(row.end_sec),
    urlAtTimestamp: optionalString(row.url_at_timestamp),
    quote: optionalString(row.quote),
    relevanceScore: optionalNumber(row.relevance_score),
  }
}

function mapSourceRow(row: Record<string, unknown>): Source {
  return {
    id: String(row.id),
    type: String(row.type) as Source['type'],
    name: String(row.name),
    url: optionalString(row.url),
    author: optionalString(row.author),
    description: optionalString(row.description),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function mapSourceItemRow(row: Record<string, unknown>): SourceItem {
  return {
    id: String(row.id),
    sourceId: String(row.source_id),
    title: String(row.title),
    url: String(row.url),
    externalId: optionalString(row.external_id),
    publishedAt: optionalString(row.published_at),
    durationSec: optionalNumber(row.duration_sec),
    language: optionalString(row.language),
    r2Key: optionalString(row.r2_key),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function optionalString(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function optionalNumber(value: unknown) {
  return typeof value === 'number' ? value : undefined
}
