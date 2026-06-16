import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { BusinessIdea, CapitalRequired, Difficulty, Source, SourceItem, TimeToRevenue } from '@/features/business-ideas/types'
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

const now = '2026-06-16T00:00:00.000Z'
const outDir = '.private/r2'

export function buildCatalogFromImports(inputDir = '.private/imports') {
  const hubspot = readJson<HubspotImport>(join(inputDir, 'hubspot-mfm-ideas.json'))
  const mfm = readJson<MfmImport>(join(inputDir, 'mfm-latest-episodes.json'))

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
    ...mfm.episodes.map((episode, index) => ({
      id: `source_item_mfm_${String(index + 1).padStart(2, '0')}_${slugify(episode.title).slice(0, 48)}`,
      sourceId: 'source_mfm',
      title: episode.title,
      url: episode.url,
      publishedAt: episode.publishedAt,
      language: 'en',
      transcriptStatus: episode.transcriptStatus,
      createdAt: now,
      updatedAt: now,
    })),
  ]

  const seenSlugs = new Map<string, number>()
  const ideas = hubspot.ideas.map((row) => toBusinessIdea(row, seenSlugs))
  writeCatalogFiles({ sources, sourceItems, ideas })
  writeSeedSql({ sources, sourceItems, ideas })

  return {
    sources: sources.length,
    sourceItems: sourceItems.length,
    ideas: ideas.length,
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
