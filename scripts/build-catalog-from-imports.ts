import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type {
  BusinessIdea,
  CapitalRequired,
  Difficulty,
  Source,
  SourceItem,
  SourceType,
  TimeToRevenue,
} from '@/features/business-ideas/types'
import { ideaToSearchMarkdown } from '@/lib/markdown'

type HubspotImport = {
  sourceUrl: string
  ideas: Array<{
    title: string
    description?: string
    category?: string
    useCase?: string
    episodeUrl?: string
    sourceUrl: string
  }>
}

type MfmImport = {
  episodesUrl: string
  episodes: Array<{
    title: string
    url: string
    publishedAt?: string
    transcriptStatus: 'available' | 'unavailable' | 'pending'
  }>
}

type PreparedTranscript = {
  index: number
  title: string
  pageUrl: string
  youtubeId?: string
  youtubeUrl?: string
  youtubeTitle?: string
  sourceItemId?: string
  transcriptStatus: 'available' | 'unavailable'
}

type MfmExtractedIdea = {
  title: string
  oneLiner: string
  summary: string
  problem?: string
  targetCustomer?: string
  solution?: string
  businessModels: string[]
  industries: string[]
  capitalRequired: CapitalRequired
  difficulty: Difficulty
  timeToRevenue: TimeToRevenue
  quote: string
  confidence: number
  sourceItemId?: string
  sourceTitle: string
  sourceUrl: string
  chunkId?: string
  startSec?: number
  endSec?: number
  urlAtTimestamp?: string
  review?: {
    decision: 'accept' | 'reject'
    reason: string
    publicQuality: number
  }
}

type CuratedSourceImport = {
  sources: Array<{
    id: string
    type: SourceType
    name: string
    url?: string
    author?: string
    description?: string
    items?: Array<{
      id: string
      title: string
      url: string
      externalId?: string
      publishedAt?: string
      language?: string
      transcriptStatus?: SourceItem['transcriptStatus']
    }>
  }>
  ideas: Array<{
    title: string
    oneLiner: string
    summary: string
    problem?: string
    targetCustomer?: string
    solution?: string
    businessModels: string[]
    industries: string[]
    skillsRequired?: string[]
    distributionChannels?: string[]
    capitalRequired: CapitalRequired
    difficulty: Difficulty
    timeToRevenue: TimeToRevenue
    soloFounderFit: number
    aiLeverage: number
    b2bFit: number
    boringBusinessScore: number
    competitionLevel?: BusinessIdea['competitionLevel']
    geography?: string
    monetization?: string
    sourceConfidence: number
    evidence: Array<{
      sourceId?: string
      sourceItemId?: string
      sourceTitle: string
      sourceType?: SourceType
      sourceUrl: string
      urlAtTimestamp?: string
      quote?: string
      reason?: string
      relevanceScore?: number
    }>
  }>
}

const now = '2026-06-16T00:00:00.000Z'
const outDir = '.private/r2'

export function buildCatalogFromImports(inputDir = '.private/imports') {
  const hubspot = readJson<HubspotImport>(join(inputDir, 'hubspot-mfm-ideas.json'))
  const mfm = readJson<MfmImport>(join(inputDir, 'mfm-latest-episodes.json'))
  const preparedTranscripts = readOptionalJson<PreparedTranscript[]>('.private/transcripts/mfm/prepared-transcripts.json') ?? []
  const extractedMfmIdeas =
    readOptionalJson<MfmExtractedIdea[]>('.private/extractions/mfm/mfm-reviewed-ideas.json') ??
    readOptionalJson<MfmExtractedIdea[]>('.private/extractions/mfm/mfm-extracted-ideas.json') ??
    []
  const preservedIdeas = readOptionalJson<BusinessIdea[]>(join(inputDir, 'preserved-business-ideas.json')) ?? []
  const curatedImport = readOptionalJson<CuratedSourceImport>(join(inputDir, 'curated-source-ideas.json')) ?? {
    sources: [],
    ideas: [],
  }

  const sources: Source[] = [
    {
      id: 'source_mfm',
      type: 'podcast',
      name: 'My First Million',
      url: mfm.episodesUrl,
      author: 'Sam Parr and Shaan Puri',
      description: 'Podcast episodes and idea discussions used as source-backed business idea inputs.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'source_hubspot_mfm_ideas',
      type: 'case_study',
      name: 'MFM Business Idea Database',
      url: hubspot.sourceUrl,
      author: 'HubSpot / My First Million',
      description: 'Public idea database used as a seed source for structured business ideas.',
      createdAt: now,
      updatedAt: now,
    },
    ...curatedImport.sources.map((source) => ({
      id: source.id,
      type: source.type,
      name: source.name,
      url: source.url,
      author: source.author,
      description: source.description,
      createdAt: now,
      updatedAt: now,
    })),
  ]

  const sourceItems: SourceItem[] = [
    {
      id: 'source_item_hubspot_mfm_database',
      sourceId: 'source_hubspot_mfm_ideas',
      title: 'MFM Business Idea Database',
      url: hubspot.sourceUrl,
      publishedAt: now,
      language: 'en',
      transcriptStatus: 'available',
      r2Key: 'sources/hubspot-mfm-ideas.json',
      createdAt: now,
      updatedAt: now,
    },
    ...mfm.episodes.map((episode, index) => {
      const transcript = preparedTranscripts.find((item) => item.index === index + 1 || item.pageUrl === episode.url)

      return {
        id: transcript?.sourceItemId ?? `source_item_mfm_${String(index + 1).padStart(2, '0')}_${slugify(episode.title).slice(0, 48)}`,
        sourceId: 'source_mfm',
        title: transcript?.youtubeTitle ?? episode.title,
        url: transcript?.youtubeUrl ?? episode.url,
        externalId: transcript?.youtubeId,
        publishedAt: episode.publishedAt,
        language: 'en',
        transcriptStatus: transcript?.transcriptStatus ?? episode.transcriptStatus,
        createdAt: now,
        updatedAt: now,
      }
    }),
    ...curatedImport.sources.flatMap((source) =>
      (source.items ?? []).map((item) => ({
        id: item.id,
        sourceId: source.id,
        title: item.title,
        url: item.url,
        externalId: item.externalId,
        publishedAt: item.publishedAt,
        language: item.language ?? 'en',
        transcriptStatus: item.transcriptStatus,
        createdAt: now,
        updatedAt: now,
      })),
    ),
  ]

  const seenSlugs = new Map<string, number>()
  const ideas = hubspot.ideas.map((row) => toBusinessIdea(row, seenSlugs))
  for (const row of extractedMfmIdeas.filter(isUsableMfmIdea)) {
    addMfmIdea(ideas, row, seenSlugs)
  }
  for (const row of curatedImport.ideas.filter(isUsableCuratedIdea)) {
    addCuratedIdea(ideas, row, seenSlugs)
  }
  preserveExistingIdeas(ideas, preservedIdeas, seenSlugs)

  writeCatalogFiles({ sources, sourceItems, ideas })
  writeSeedSql({ sources, sourceItems, ideas })

  return {
    sources: sources.length,
    sourceItems: sourceItems.length,
    ideas: ideas.length,
  }
}

function addCuratedIdea(
  ideas: BusinessIdea[],
  row: CuratedSourceImport['ideas'][number],
  seenSlugs: Map<string, number>,
) {
  const existing = ideas.find((idea) => normalizeKey(idea.title) === normalizeKey(row.title))

  if (existing) {
    existing.evidence.push(
      ...row.evidence.map((evidence, index) =>
        toCuratedEvidence(evidence, existing.id, existing.slug, existing.evidence.length + index + 1),
      ),
    )
    existing.sourceConfidence = Math.max(existing.sourceConfidence, row.sourceConfidence)
    return
  }

  ideas.push(toCuratedBusinessIdea(row, seenSlugs))
}

function addMfmIdea(ideas: BusinessIdea[], row: MfmExtractedIdea, seenSlugs: Map<string, number>) {
  const existing = ideas.find((idea) => normalizeKey(idea.title) === normalizeKey(row.title))

  if (existing) {
    existing.evidence.push(toMfmEvidence(row, existing.id, existing.slug, existing.evidence.length + 1))
    existing.sourceConfidence = Math.max(existing.sourceConfidence, row.confidence)
    return
  }

  ideas.push(toMfmBusinessIdea(row, seenSlugs))
}

function preserveExistingIdeas(ideas: BusinessIdea[], preservedIdeas: BusinessIdea[], seenSlugs: Map<string, number>) {
  const existingSlugs = new Set(ideas.map((idea) => idea.slug))

  for (const idea of preservedIdeas) {
    if (existingSlugs.has(idea.slug)) {
      continue
    }

    ideas.push(idea)
    existingSlugs.add(idea.slug)
    seenSlugs.set(idea.slug, Math.max(seenSlugs.get(idea.slug) ?? 0, 1))
  }
}

function toCuratedBusinessIdea(row: CuratedSourceImport['ideas'][number], seenSlugs: Map<string, number>): BusinessIdea {
  const baseSlug = slugify(row.title)
  const seenCount = seenSlugs.get(baseSlug) ?? 0
  seenSlugs.set(baseSlug, seenCount + 1)
  const slug = seenCount === 0 ? baseSlug : `${baseSlug}-${seenCount + 1}`
  const id = `idea_${slug}`
  const text = `${row.title} ${row.oneLiner} ${row.summary} ${row.problem ?? ''} ${row.solution ?? ''}`.toLowerCase()

  return {
    id,
    slug,
    title: normalizeText(row.title),
    oneLiner: normalizeText(row.oneLiner),
    summary: normalizeText(row.summary),
    problem: normalizeText(row.problem),
    targetCustomer: normalizeText(row.targetCustomer),
    solution: normalizeText(row.solution),
    businessModels: normalizeExtractedList(row.businessModels, ['service']),
    industries: normalizeExtractedList(row.industries, ['business']),
    skillsRequired: normalizeExtractedList(row.skillsRequired ?? [], skillsForMfmIdea(text)),
    distributionChannels: normalizeExtractedList(row.distributionChannels ?? [], distributionForMfmIdea(text)),
    capitalRequired: row.capitalRequired,
    difficulty: row.difficulty,
    timeToRevenue: row.timeToRevenue,
    soloFounderFit: clampScore(row.soloFounderFit),
    aiLeverage: clampScore(row.aiLeverage),
    b2bFit: clampScore(row.b2bFit),
    boringBusinessScore: clampScore(row.boringBusinessScore),
    competitionLevel: row.competitionLevel ?? 'medium',
    geography: normalizeText(row.geography),
    monetization: normalizeText(row.monetization),
    sourceConfidence: row.sourceConfidence,
    createdAt: now,
    updatedAt: now,
    evidence: row.evidence.map((evidence, index) => toCuratedEvidence(evidence, id, slug, index + 1)),
  }
}

function toCuratedEvidence(
  row: CuratedSourceImport['ideas'][number]['evidence'][number],
  ideaId: string,
  slug: string,
  index: number,
) {
  const suffix = String(index).padStart(3, '0')

  return {
    id: `evidence_${slug}_curated_${suffix}`,
    ideaId,
    sourceId: row.sourceId,
    sourceItemId: row.sourceItemId,
    sourceTitle: row.sourceTitle,
    sourceType: row.sourceType,
    sourceUrl: row.sourceUrl,
    urlAtTimestamp: row.urlAtTimestamp ?? row.sourceUrl,
    quote: shortQuote(normalizeText(row.quote), 18),
    reason: normalizeText(row.reason) || 'Curated from an external source with a concrete customer problem or founder case study.',
    relevanceScore: row.relevanceScore,
  }
}

function toMfmBusinessIdea(row: MfmExtractedIdea, seenSlugs: Map<string, number>): BusinessIdea {
  const baseSlug = slugify(row.title)
  const seenCount = seenSlugs.get(baseSlug) ?? 0
  seenSlugs.set(baseSlug, seenCount + 1)
  const slug = seenCount === 0 ? baseSlug : `${baseSlug}-${seenCount + 1}`
  const id = `idea_${slug}`
  const businessModels = normalizeExtractedList(row.businessModels, ['service'])
  const industries = normalizeExtractedList(row.industries, ['business'])
  const text = `${row.title} ${row.oneLiner} ${row.summary} ${row.problem ?? ''} ${row.solution ?? ''}`.toLowerCase()

  return {
    id,
    slug,
    title: normalizeText(row.title),
    oneLiner: normalizeText(row.oneLiner),
    summary: normalizeText(row.summary),
    problem: normalizeText(row.problem),
    targetCustomer: normalizeText(row.targetCustomer),
    solution: normalizeText(row.solution),
    businessModels,
    industries,
    skillsRequired: skillsForMfmIdea(text),
    distributionChannels: distributionForMfmIdea(text),
    capitalRequired: row.capitalRequired,
    difficulty: row.difficulty,
    timeToRevenue: row.timeToRevenue,
    soloFounderFit: text.includes('marketplace') || row.capitalRequired === 'high' ? 5 : 8,
    aiLeverage: /\bai\b|agent|llm|automation/.test(text) ? 9 : 5,
    b2bFit: /b2b|business|company|founder|operator|enterprise|sales|revenue/.test(text) ? 8 : 4,
    boringBusinessScore: /service|operations|workflow|back office|local/.test(text) ? 8 : 5,
    competitionLevel: 'medium',
    geography: 'Validate in the audience and market referenced by the source episode.',
    monetization: `Start with ${businessModels[0]} pricing and validate willingness to pay from the source-backed customer segment.`,
    sourceConfidence: row.confidence,
    createdAt: now,
    updatedAt: now,
    evidence: [toMfmEvidence(row, id, slug, 1)],
  }
}

function toMfmEvidence(row: MfmExtractedIdea, ideaId: string, slug: string, index: number) {
  const suffix = String(index).padStart(3, '0')

  return {
    id: `evidence_${slug}_mfm_${suffix}`,
    ideaId,
    sourceId: 'source_mfm',
    sourceItemId: row.sourceItemId,
    chunkId: row.chunkId,
    sourceTitle: row.sourceTitle,
    sourceType: 'podcast' as const,
    sourceUrl: row.sourceUrl,
    startSec: row.startSec,
    endSec: row.endSec,
    urlAtTimestamp: row.urlAtTimestamp ?? row.sourceUrl,
    quote: shortQuote(normalizeText(row.quote), 18),
    reason: `Extracted from a source-backed My First Million transcript chunk with confidence ${Math.round(row.confidence * 100)}%.`,
    relevanceScore: row.confidence,
  }
}

function toBusinessIdea(row: HubspotImport['ideas'][number], seenSlugs: Map<string, number>): BusinessIdea {
  const baseSlug = slugify(row.title)
  const seenCount = seenSlugs.get(baseSlug) ?? 0
  seenSlugs.set(baseSlug, seenCount + 1)
  const slug = seenCount === 0 ? baseSlug : `${baseSlug}-${seenCount + 1}`
  const category = row.category ?? 'Other'
  const useCases = splitList(row.useCase)
  const industries = useCases.length > 0 ? useCases.map(normalizeLabel) : [normalizeLabel(category)]
  const businessModels = businessModelsForCategory(category)
  const description = normalizeText(row.description)
  const quote = shortQuote(description)
  const opportunity = quote || `A source-backed ${category.toLowerCase()} idea in ${industries.join(', ')}.`

  return {
    id: `idea_${slug}`,
    slug,
    title: row.title,
    oneLiner: `${row.title}: ${normalizeLabel(category)} opportunity for ${industries.join(', ')}.`,
    summary: `Source-backed opportunity from the MFM Business Idea Database. The source frames it as: "${opportunity}"`,
    problem: `A customer segment in ${industries.join(', ')} has a recurring need that can be packaged as a focused ${businessModels[0]} offer.`,
    targetCustomer: `Customers in ${industries.join(', ')} who already show demand for this category of solution.`,
    solution: `Start with a narrow offer around ${row.title}, validate demand from the source episode/context, then package the repeatable workflow.`,
    businessModels,
    industries,
    skillsRequired: skillsForCategory(category),
    distributionChannels: distributionForCategory(category),
    capitalRequired: capitalForCategory(category),
    difficulty: difficultyForCategory(category),
    timeToRevenue: timeToRevenueForCategory(category),
    soloFounderFit: soloFounderFitForCategory(category),
    aiLeverage: category === 'AI-Powered' ? 9 : category === 'Digital Product' ? 7 : 5,
    b2bFit: b2bFitForUseCases(useCases),
    boringBusinessScore: category === 'Service' || category === 'Brick-n-Mortar' ? 8 : 6,
    competitionLevel: 'medium',
    geography: 'Validate in the market referenced by the source before expanding.',
    monetization: monetizationForCategory(category),
    sourceConfidence: 0.72,
    createdAt: now,
    updatedAt: now,
    evidence: [
      {
        id: `evidence_${slug}_001`,
        ideaId: `idea_${slug}`,
        sourceId: 'source_hubspot_mfm_ideas',
        sourceItemId: 'source_item_hubspot_mfm_database',
        sourceTitle: 'MFM Business Idea Database',
        sourceType: 'case_study',
        sourceUrl: row.sourceUrl,
        urlAtTimestamp: row.episodeUrl ?? row.sourceUrl,
        quote,
        reason: `HubSpot/MFM lists this as ${category}${row.useCase ? ` for ${row.useCase}` : ''}; this record keeps the public summary concise and source-linked.`,
        relevanceScore: 0.82,
      },
    ],
  }
}

function writeCatalogFiles(catalog: { sources: Source[]; sourceItems: SourceItem[]; ideas: BusinessIdea[] }) {
  rmSync(outDir, { force: true, recursive: true })
  mkdirSync(join(outDir, 'ideas'), { recursive: true })
  mkdirSync(join(outDir, 'sources'), { recursive: true })

  for (const idea of catalog.ideas) {
    writeFileSync(join(outDir, 'ideas', `${idea.id}.json`), JSON.stringify(idea, null, 2))
    writeFileSync(join(outDir, 'ideas', `${idea.id}.md`), ideaToSearchMarkdown(idea))
  }

  writeFileSync(join(outDir, 'sources.json'), JSON.stringify(catalog.sources, null, 2))
  writeFileSync(join(outDir, 'source-items.json'), JSON.stringify(catalog.sourceItems, null, 2))
  writeFileSync(join(outDir, 'sources', 'hubspot-mfm-ideas.json'), JSON.stringify(catalog.ideas, null, 2))
}

function writeSeedSql(catalog: { sources: Source[]; sourceItems: SourceItem[]; ideas: BusinessIdea[] }) {
  const lines: string[] = [
    'delete from idea_evidence;',
    'delete from business_ideas;',
    'delete from source_items;',
    'delete from sources;',
  ]

  for (const source of catalog.sources) {
    lines.push(
      `insert into sources (id, type, name, url, author, description, created_at, updated_at) values (${q(source.id)}, ${q(source.type)}, ${q(source.name)}, ${q(source.url)}, ${q(source.author)}, ${q(source.description)}, ${q(source.createdAt)}, ${q(source.updatedAt)});`,
    )
  }

  for (const item of catalog.sourceItems) {
    lines.push(
      `insert into source_items (id, source_id, title, url, external_id, published_at, duration_sec, language, r2_key, raw_metadata_json, created_at, updated_at) values (${q(item.id)}, ${q(item.sourceId)}, ${q(item.title)}, ${q(item.url)}, ${q(item.externalId)}, ${q(item.publishedAt)}, ${n(item.durationSec)}, ${q(item.language)}, ${q(item.r2Key)}, ${q(JSON.stringify({ transcriptStatus: item.transcriptStatus }))}, ${q(item.createdAt)}, ${q(item.updatedAt)});`,
    )
  }

  for (const idea of catalog.ideas) {
    lines.push(
      `insert into business_ideas (id, slug, title, one_liner, primary_industry, primary_business_model, capital_required, difficulty, time_to_revenue, solo_founder_fit, ai_leverage, b2b_fit, boring_business_score, competition_level, geography, r2_json_key, r2_markdown_key, source_confidence, created_at, updated_at) values (${q(idea.id)}, ${q(idea.slug)}, ${q(idea.title)}, ${q(idea.oneLiner)}, ${q(idea.industries[0])}, ${q(idea.businessModels[0])}, ${q(idea.capitalRequired)}, ${q(idea.difficulty)}, ${q(idea.timeToRevenue)}, ${n(idea.soloFounderFit)}, ${n(idea.aiLeverage)}, ${n(idea.b2bFit)}, ${n(idea.boringBusinessScore)}, ${q(idea.competitionLevel)}, ${q(idea.geography)}, ${q(`ideas/${idea.id}.json`)}, ${q(`ideas/${idea.id}.md`)}, ${n(idea.sourceConfidence)}, ${q(idea.createdAt)}, ${q(idea.updatedAt)});`,
    )

    for (const evidence of idea.evidence) {
      lines.push(
        `insert into idea_evidence (id, idea_id, source_id, source_item_id, chunk_id, source_title, source_url, start_sec, end_sec, url_at_timestamp, quote, relevance_score, r2_chunk_key, created_at) values (${q(evidence.id)}, ${q(evidence.ideaId)}, ${q(evidence.sourceId)}, ${q(evidence.sourceItemId)}, ${q(evidence.chunkId)}, ${q(evidence.sourceTitle)}, ${q(evidence.sourceUrl)}, ${n(evidence.startSec)}, ${n(evidence.endSec)}, ${q(evidence.urlAtTimestamp)}, ${q(evidence.quote)}, ${n(evidence.relevanceScore)}, null, ${q(idea.createdAt)});`,
      )
    }
  }

  writeFileSync('.private/seed-catalog.sql', lines.join('\n'))
}

function readJson<T>(path: string) {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

function readOptionalJson<T>(path: string) {
  return existsSync(path) ? readJson<T>(path) : undefined
}

function isUsableMfmIdea(row: MfmExtractedIdea) {
  return (
    row.confidence >= 0.7 &&
    Boolean(normalizeText(row.title)) &&
    Boolean(normalizeText(row.oneLiner)) &&
    Boolean(normalizeText(row.summary)) &&
    Boolean(normalizeText(row.quote)) &&
    Boolean(row.sourceItemId) &&
    Boolean(row.chunkId) &&
    (!row.review || (row.review.decision === 'accept' && row.review.publicQuality >= 0.75))
  )
}

function isUsableCuratedIdea(row: CuratedSourceImport['ideas'][number]) {
  return (
    row.sourceConfidence >= 0.7 &&
    Boolean(normalizeText(row.title)) &&
    Boolean(normalizeText(row.oneLiner)) &&
    Boolean(normalizeText(row.summary)) &&
    row.businessModels.length > 0 &&
    row.industries.length > 0 &&
    row.evidence.some((evidence) => Boolean(normalizeText(evidence.sourceTitle)) && Boolean(normalizeText(evidence.sourceUrl)))
  )
}

function normalizeExtractedList(values: string[], fallback: string[]) {
  const normalized = values.map(normalizeText).filter(Boolean).map(normalizeLabel)
  return normalized.length > 0 ? [...new Set(normalized)] : fallback
}

function normalizeKey(value: string) {
  return slugify(value).replace(/^ai-/, '')
}

function skillsForMfmIdea(text: string) {
  const skills = ['customer discovery', 'distribution', 'product validation']
  if (/\bai\b|agent|llm|automation/.test(text)) skills.unshift('LLM workflows')
  if (/marketplace/.test(text)) skills.push('supply acquisition')
  if (/content|newsletter|creator/.test(text)) skills.push('audience building')
  return [...new Set(skills)]
}

function distributionForMfmIdea(text: string) {
  if (/local|real estate|home|service/.test(text)) return ['local SEO', 'cold outreach', 'referrals']
  if (/creator|content|newsletter|media/.test(text)) return ['X', 'newsletter', 'creator partnerships']
  return ['SEO', 'cold outreach', 'partnerships']
}

function clampScore(value: number) {
  return Math.max(1, Math.min(10, Math.round(value)))
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)
}

function normalizeText(value?: string) {
  return (value ?? '').replace(/\s+/g, ' ').trim()
}

function splitList(value?: string) {
  return normalizeText(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeLabel(value: string) {
  return value.toLowerCase().replace(/&/g, 'and')
}

function shortQuote(value: string, maxWords = 22) {
  const words = value.split(/\s+/).filter(Boolean)
  return words.slice(0, maxWords).join(' ')
}

function businessModelsForCategory(category: string) {
  const map: Record<string, string[]> = {
    'AI-Powered': ['saas', 'ai-enabled service'],
    'Digital Product': ['digital product', 'subscription'],
    'Physical Product': ['physical product', 'ecommerce'],
    'Brick-n-Mortar': ['local business', 'retail'],
    Marketplace: ['marketplace', 'take rate'],
    Service: ['service', 'done-for-you'],
    'Events & Experience': ['events', 'ticketing'],
    Ecommerce: ['ecommerce', 'direct-to-consumer'],
    Content: ['content', 'sponsorship'],
  }
  return map[category] ?? ['service']
}

function skillsForCategory(category: string) {
  const map: Record<string, string[]> = {
    'AI-Powered': ['LLM workflows', 'product design', 'sales'],
    'Digital Product': ['product design', 'software', 'growth'],
    'Physical Product': ['sourcing', 'operations', 'brand'],
    'Brick-n-Mortar': ['local operations', 'hiring', 'real estate'],
    Marketplace: ['supply acquisition', 'demand generation', 'operations'],
    Service: ['sales', 'operations', 'customer delivery'],
    'Events & Experience': ['event operations', 'partnerships', 'community'],
    Ecommerce: ['paid acquisition', 'sourcing', 'conversion optimization'],
    Content: ['writing', 'audience building', 'sponsorship sales'],
  }
  return map[category] ?? ['sales', 'operations']
}

function distributionForCategory(category: string) {
  if (category === 'Content') return ['SEO', 'X', 'newsletter', 'short-form clips']
  if (category === 'Ecommerce' || category === 'Physical Product') return ['paid social', 'creator partnerships', 'SEO']
  if (category === 'Brick-n-Mortar' || category === 'Service') return ['local SEO', 'cold outreach', 'referrals']
  return ['SEO', 'cold outreach', 'partnerships']
}

function capitalForCategory(category: string): CapitalRequired {
  if (category === 'Brick-n-Mortar' || category === 'Physical Product') return 'medium'
  if (category === 'Marketplace') return 'medium'
  return 'low'
}

function difficultyForCategory(category: string): Difficulty {
  if (category === 'Marketplace' || category === 'AI-Powered') return 'high'
  if (category === 'Service' || category === 'Content') return 'medium'
  return 'medium'
}

function timeToRevenueForCategory(category: string): TimeToRevenue {
  if (category === 'Service' || category === 'Events & Experience') return 'weeks'
  if (category === 'Content' || category === 'Marketplace') return 'months'
  return 'months'
}

function soloFounderFitForCategory(category: string) {
  if (category === 'Brick-n-Mortar' || category === 'Marketplace') return 5
  if (category === 'Content' || category === 'Digital Product') return 8
  return 7
}

function b2bFitForUseCases(useCases: string[]) {
  const value = useCases.join(' ').toLowerCase()
  if (/operations|marketing|legal|real estate|productivity/.test(value)) return 8
  if (/entertainment|lifestyle|beauty|personal/.test(value)) return 4
  return 6
}

function monetizationForCategory(category: string) {
  const map: Record<string, string> = {
    'AI-Powered': 'Subscription or usage-based pricing after a narrow workflow wedge.',
    'Digital Product': 'Subscription, template, app, or paid community pricing.',
    'Physical Product': 'Product margin with bundles, subscriptions, or accessories.',
    'Brick-n-Mortar': 'Local service/retail margin with repeat purchase loops.',
    Marketplace: 'Take rate, listing fees, or paid matching.',
    Service: 'Fixed-fee delivery, retainer, or productized service package.',
    'Events & Experience': 'Ticketing, sponsorship, premium packages, or memberships.',
    Ecommerce: 'Product margin, bundles, subscriptions, and email remarketing.',
    Content: 'Sponsorship, affiliate, paid newsletter, or digital products.',
  }
  return map[category] ?? 'Package the repeatable part of demand into a paid offer.'
}

const q = (value: unknown) => (value === undefined || value === null ? 'null' : `'${String(value).replaceAll("'", "''")}'`)
const n = (value: unknown) => (value === undefined || value === null ? 'null' : String(value))

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = buildCatalogFromImports()
  console.log(`Built catalog: ${result.ideas} ideas, ${result.sourceItems} source items, ${result.sources} sources`)
}
