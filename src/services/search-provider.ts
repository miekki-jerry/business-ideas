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
    const queryTokens = tokenize([input.query, input.profile?.whoAreYou, input.profile?.notes, input.profile?.skills?.join(' ')].join(' '))
    const ideas = await this.repository.listIdeas()

    return ideas
      .filter((idea) => matchesFilters(idea, input.filters))
      .map((idea) => {
        const haystack = tokenize(
          [
            idea.title,
            idea.oneLiner,
            idea.summary,
            idea.problem,
            idea.targetCustomer,
            idea.solution,
            idea.businessModels.join(' '),
            idea.industries.join(' '),
            idea.skillsRequired.join(' '),
          ].join(' '),
        )
        const overlap = queryTokens.filter((token) => haystack.includes(token)).length
        const profileBoost = scoreProfileFit(idea, input)
        const score = Math.min(0.99, 0.35 + overlap * 0.08 + profileBoost)

        return {
          idea,
          score: Number(score.toFixed(2)),
          fitReason: buildFitReason(idea, input),
          matchedEvidence: idea.evidence.slice(0, 2),
        }
      })
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
    const payload = await this.search
      .search({
        query: input.query,
        max_num_results: input.limit ?? 10,
        filters: toAiSearchMetadataFilters(input.filters),
      })
      .catch(() => null)

    if (!payload) {
      return fallback.searchIdeas(input)
    }

    const matches = payload.data ?? payload.result?.data ?? []
    const results: IdeaSearchResult[] = []

    for (const match of matches) {
      const ideaId = match.filename?.match(/ideas\/(.+)\.md$/)?.[1]
      if (!ideaId) {
        continue
      }

      const idea = await this.repository.getIdeaById(ideaId)
      if (!idea) {
        continue
      }

      results.push({
        idea,
        score: match.score ?? 0.5,
        fitReason: buildFitReason(idea, input),
        matchedEvidence: idea.evidence.slice(0, 2),
      })
    }

    return results.length > 0 ? results : fallback.searchIdeas(input)
  }

  async getSimilarIdeas(input: { ideaId: string; limit?: number }) {
    const fallback = new LocalIdeaSearchProvider(this.repository)
    return fallback.getSimilarIdeas(input)
  }
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
    score += idea.b2bFit / 40
  }

  if (input.profile?.wantsSoloFounder) {
    score += idea.soloFounderFit / 50
  }

  if (input.profile?.wantsAiLeverage) {
    score += idea.aiLeverage / 50
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

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2)
}

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
