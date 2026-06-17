import type { Env, IdeasRepository } from '@/services/repository'
import type { BusinessIdea, IdeaFilters, IdeaSearchInput, IdeaSearchResult } from '@/features/business-ideas/types'

export interface IdeaSearchProvider {
  searchIdeas(input: IdeaSearchInput): Promise<IdeaSearchResult[]>
  getSimilarIdeas(input: { ideaId: string; limit?: number }): Promise<IdeaSearchResult[]>
}

export function createSearchProvider(repository: IdeasRepository, env?: Env): IdeaSearchProvider {
  if (env?.BUSINESS_IDEAS_SEARCH) {
    return new CloudflareAISearchProvider(repository, env.BUSINESS_IDEAS_SEARCH)
  }

  return new LocalIdeaSearchProvider(repository)
}

class LocalIdeaSearchProvider implements IdeaSearchProvider {
  constructor(private readonly repository: IdeasRepository) {}

  async searchIdeas(input: IdeaSearchInput): Promise<IdeaSearchResult[]> {
    const limit = input.limit ?? 10
    const queryTerms = expandQuery(input.query)
    const ideas = await this.repository.listIdeas()

    return ideas
      .filter((idea) => matchesFilters(idea, input.filters))
      .map((idea) => {
        const relevanceScore = scoreIdeaRelevance(idea, queryTerms, input.query)
        const profileBoost = scoreProfileFit(idea, input)
        const score = relevanceScore > 0
          ? Math.min(0.99, relevanceScore + profileBoost + idea.sourceConfidence * 0.03)
          : 0

        return {
          idea,
          score: Number(score.toFixed(2)),
          fitReason: buildFitReason(idea, input),
          matchedEvidence: idea.evidence.slice(0, 2),
        }
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  async getSimilarIdeas(input: { ideaId: string; limit?: number }) {
    const idea = await this.repository.getIdeaById(input.ideaId)
    if (!idea) {
      return []
    }

    return this.searchIdeas({
      query: [idea.title, idea.oneLiner, idea.industries.join(' '), idea.businessModels.join(' ')].join(' '),
      limit: input.limit ?? 5,
    }).then((results) => results.filter((result) => result.idea.id !== input.ideaId))
  }
}

class CloudflareAISearchProvider implements IdeaSearchProvider {
  constructor(
    private readonly repository: IdeasRepository,
    private readonly search: NonNullable<Env['BUSINESS_IDEAS_SEARCH']>,
  ) {}

  async searchIdeas(input: IdeaSearchInput): Promise<IdeaSearchResult[]> {
    const fallback = new LocalIdeaSearchProvider(this.repository)
    const fallbackResults = await fallback.searchIdeas(input)
    const aiSearchLimit = Math.min(50, Math.max(input.limit ?? 10, 10))
    const searchQuery = buildAiSearchQuery(input.query)
    const legacySearchInput = {
      query: searchQuery,
      max_num_results: aiSearchLimit,
      filters: toAiSearchMetadataFilters(input.filters),
    }
    const payload = await this.search
      .search({
        ...legacySearchInput,
        query: searchQuery,
        messages: [{ role: 'user', content: searchQuery }],
        max_num_results: aiSearchLimit,
        filters: toAiSearchMetadataFilters(input.filters),
        ai_search_options: {
          retrieval: {
            retrieval_type: 'hybrid',
            keyword_match_mode: 'or',
            fusion_method: 'rrf',
            match_threshold: 0.18,
            max_num_results: aiSearchLimit,
            filters: toAiSearchMetadataFilters(input.filters),
          },
          reranking: {
            enabled: true,
            model: '@cf/baai/bge-reranker-base',
          },
        },
      })
      .catch(() => this.search.search(legacySearchInput).catch(() => null))

    if (!payload) {
      return fallbackResults
    }

    let matches = payload.chunks ?? payload.data ?? payload.result?.data ?? []

    if (matches.length === 0) {
      const legacyPayload = await this.search.search(legacySearchInput).catch(() => null)
      matches = legacyPayload?.chunks ?? legacyPayload?.data ?? legacyPayload?.result?.data ?? []
    }
    const results: IdeaSearchResult[] = []
    const queryTerms = expandQuery(input.query)

    for (const match of matches) {
      const ideaId = getIdeaIdFromSearchMatch(match)
      if (!ideaId) {
        continue
      }

      const idea = await this.repository.getIdeaById(ideaId)
      if (!idea) {
        continue
      }

      const localRelevance = scoreIdeaRelevance(idea, queryTerms, input.query)
      const profileBoost = scoreProfileFit(idea, input)
      const normalizedAiScore = Math.max(0, Math.min(1, match.score ?? 0.5))

      results.push({
        idea,
        score: Number(Math.min(0.99, normalizedAiScore * 0.65 + localRelevance * 0.25 + profileBoost).toFixed(2)),
        fitReason: buildFitReason(idea, input),
        matchedEvidence: idea.evidence.slice(0, 2),
      })
    }

    return mergeSearchResults([...results, ...fallbackResults]).slice(0, input.limit ?? 10)
  }

  async getSimilarIdeas(input: { ideaId: string; limit?: number }) {
    const fallback = new LocalIdeaSearchProvider(this.repository)
    return fallback.getSimilarIdeas(input)
  }
}

function mergeSearchResults(results: IdeaSearchResult[]) {
  const byIdeaId = new Map<string, IdeaSearchResult>()

  for (const result of results) {
    const existing = byIdeaId.get(result.idea.id)
    if (!existing || result.score > existing.score) {
      byIdeaId.set(result.idea.id, result)
    }
  }

  return [...byIdeaId.values()].sort((a, b) => b.score - a.score)
}

function getIdeaIdFromSearchMatch(match: { filename?: string; path?: string; item?: { key?: string } }) {
  return (match.filename ?? match.path ?? match.item?.key)?.match(/^ideas\/(.+)\.md$/)?.[1]
}

function matchesFilters(idea: BusinessIdea, filters?: IdeaFilters) {
  if (!filters) {
    return true
  }

  if (filters.industries?.length && !filters.industries.some((industry) => idea.industries.includes(industry))) {
    return false
  }

  if (filters.businessModels?.length && !filters.businessModels.some((model) => idea.businessModels.includes(model))) {
    return false
  }

  if (filters.capitalRequired?.length && !filters.capitalRequired.includes(idea.capitalRequired)) {
    return false
  }

  if (filters.difficulty?.length && !filters.difficulty.includes(idea.difficulty)) {
    return false
  }

  if (filters.timeToRevenue?.length && !filters.timeToRevenue.includes(idea.timeToRevenue)) {
    return false
  }

  if (filters.minSoloFounderFit && idea.soloFounderFit < filters.minSoloFounderFit) {
    return false
  }

  if (filters.minAiLeverage && idea.aiLeverage < filters.minAiLeverage) {
    return false
  }

  if (filters.minB2bFit && idea.b2bFit < filters.minB2bFit) {
    return false
  }

  return true
}

function scoreProfileFit(idea: BusinessIdea, input: IdeaSearchInput) {
  let score = 0

  if (input.profile?.businessPreference === 'b2b') {
    score += idea.b2bFit / 80
  }

  if (input.profile?.wantsSoloFounder) {
    score += idea.soloFounderFit / 100
  }

  if (input.profile?.wantsAiLeverage) {
    score += idea.aiLeverage / 100
  }

  if (input.profile?.capitalAvailable && idea.capitalRequired === input.profile.capitalAvailable) {
    score += 0.08
  }

  return score
}

function buildFitReason(idea: BusinessIdea, input: IdeaSearchInput) {
  const reasons = []

  if (input.profile?.wantsSoloFounder || input.filters?.minSoloFounderFit) {
    reasons.push(`solo fit ${idea.soloFounderFit}/10`)
  }

  if (input.profile?.wantsAiLeverage || input.filters?.minAiLeverage) {
    reasons.push(`AI leverage ${idea.aiLeverage}/10`)
  }

  if (input.profile?.businessPreference === 'b2b' || input.filters?.minB2bFit) {
    reasons.push(`B2B fit ${idea.b2bFit}/10`)
  }

  reasons.push(`${idea.capitalRequired} capital`)
  return `Fits because it has ${reasons.join(', ')} and ${idea.evidence.length} source-backed evidence item${idea.evidence.length === 1 ? '' : 's'}.`
}

function scoreIdeaRelevance(idea: BusinessIdea, queryTerms: string[], rawQuery: string) {
  const title = normalizeText(idea.title)
  const primaryText = normalizeText([idea.title, idea.oneLiner, idea.summary].join(' '))
  const secondaryText = normalizeText(
    [
      idea.problem,
      idea.targetCustomer,
      idea.solution,
      idea.businessModels.join(' '),
      idea.industries.join(' '),
      idea.skillsRequired.join(' '),
      idea.distributionChannels.join(' '),
      idea.monetization,
      idea.evidence.map((item) => [item.sourceTitle, item.quote, item.reason].filter(Boolean).join(' ')).join(' '),
    ].join(' '),
  )
  const normalizedQuery = normalizeText(rawQuery)
  let score = 0

  if (normalizedQuery.length > 2 && title.includes(normalizedQuery)) {
    score += 0.42
  } else if (normalizedQuery.length > 2 && primaryText.includes(normalizedQuery)) {
    score += 0.3
  }

  for (const term of queryTerms) {
    if (title.includes(term)) {
      score += 0.16
    } else if (primaryText.includes(term)) {
      score += 0.1
    } else if (secondaryText.includes(term)) {
      score += 0.06
    }
  }

  return Math.min(0.86, score)
}

function buildAiSearchQuery(query: string) {
  const expanded = expandQuery(query)
  const normalizedOriginal = normalizeText(query)
  const terms = [normalizedOriginal, ...expanded].filter(Boolean)
  return [...new Set(terms)].slice(0, 36).join(' ')
}

function expandQuery(query: string) {
  const baseTokens = tokenize(query)
  const expanded = new Set(baseTokens)
  const normalized = normalizeText(query)
  const padded = ` ${normalized} `

  for (const [canonical, aliases] of Object.entries(queryAliases)) {
    if (aliases.some((alias) => baseTokens.includes(alias) || padded.includes(` ${alias} `))) {
      for (const alias of aliases) {
        expanded.add(alias)
      }
      expanded.add(canonical)
    }
  }

  return [...expanded].filter((token) => token.length > 1)
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !stopWords.has(token))
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const queryAliases: Record<string, string[]> = {
  ai: ['ai', 'artificial', 'intelligence', 'sztuczna', 'inteligencja', 'llm', 'gpt', 'chatgpt', 'agent', 'agents', 'chatbot'],
  games: ['game', 'games', 'gaming', 'gamified', 'gamification', 'gry', 'gra', 'gier', 'grami', 'board', 'card', 'video'],
  developer: ['developer', 'developers', 'programista', 'programisty', 'programistow', 'kod', 'kodowanie', 'coding', 'software', 'devtools', 'typescript', 'automation'],
  local: ['local', 'lokalny', 'lokalne', 'lokalnych', 'lokalnego', 'nearby', 'city', 'services', 'uslugi'],
  onsite: ['onsite', 'offline', 'physical', 'inperson', 'offsite', 'stacjonarny', 'stacjonarne', 'teren', 'event', 'events', 'retreat', 'retreats'],
  newsletter: ['newsletter', 'newsletters', 'biuletyn', 'content', 'creator', 'creators', 'media'],
  education: ['education', 'edtech', 'learning', 'school', 'students', 'nauka', 'edukacja', 'szkola'],
  health: ['health', 'healthcare', 'medical', 'wellness', 'zdrowie', 'medyczny'],
  b2b: ['b2b', 'enterprise', 'saas', 'company', 'companies', 'firmy', 'firma'],
  ecommerce: ['ecommerce', 'commerce', 'shopify', 'store', 'sklep', 'ecommerce'],
}

const stopWords = new Set([
  'business',
  'businesses',
  'biznes',
  'biznesu',
  'biznesow',
  'pomysl',
  'pomysly',
  'idea',
  'ideas',
  'dla',
  'for',
  'the',
  'and',
  'with',
])

function toAiSearchMetadataFilters(filters?: IdeaFilters) {
  if (!filters) {
    return undefined
  }

  const metadataFilters: Record<string, string | number | boolean | Array<string | number | boolean>> = {}

  if (filters.capitalRequired?.length) {
    metadataFilters.capital_required = filters.capitalRequired
  }

  if (filters.difficulty?.length) {
    metadataFilters.difficulty = filters.difficulty
  }

  return Object.keys(metadataFilters).length > 0 ? metadataFilters : undefined
}
