export type SourceType =
  | 'podcast'
  | 'youtube'
  | 'blog'
  | 'newsletter'
  | 'reddit'
  | 'case_study'
  | 'book'
  | 'article'
  | 'other'

export type CapitalRequired = 'none' | 'low' | 'medium' | 'high'
export type Difficulty = 'low' | 'medium' | 'high'
export type TimeToRevenue = 'days' | 'weeks' | 'months' | 'years'

export type Source = {
  id: string
  type: SourceType
  name: string
  url?: string
  author?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export type SourceItem = {
  id: string
  sourceId: string
  title: string
  url: string
  externalId?: string
  publishedAt?: string
  durationSec?: number
  language?: string
  r2Key?: string
  rawMetadata?: Record<string, unknown>
  transcriptStatus?: 'available' | 'unavailable' | 'pending'
  createdAt: string
  updatedAt: string
}

export type IdeaEvidence = {
  id: string
  ideaId: string
  sourceId?: string
  sourceItemId?: string
  chunkId?: string
  sourceTitle: string
  sourceType?: SourceType
  sourceUrl: string
  startSec?: number
  endSec?: number
  urlAtTimestamp?: string
  quote?: string
  reason?: string
  relevanceScore?: number
}

export type BusinessIdea = {
  id: string
  slug: string
  title: string
  oneLiner: string
  summary: string
  problem?: string
  targetCustomer?: string
  solution?: string
  businessModels: string[]
  industries: string[]
  skillsRequired: string[]
  distributionChannels: string[]
  capitalRequired: CapitalRequired
  difficulty: Difficulty
  timeToRevenue: TimeToRevenue
  soloFounderFit: number
  aiLeverage: number
  b2bFit: number
  boringBusinessScore: number
  competitionLevel?: 'low' | 'medium' | 'high'
  geography?: string
  monetization?: string
  sourceConfidence: number
  evidence: IdeaEvidence[]
  createdAt: string
  updatedAt: string
}

export type UserIdeaProfile = {
  query?: string
  whoAreYou?: string
  skills?: string[]
  preferredIndustries?: string[]
  dislikedIndustries?: string[]
  businessPreference?: 'b2b' | 'b2c' | 'both'
  capitalAvailable?: CapitalRequired
  wantsSoloFounder?: boolean
  wantsAiLeverage?: boolean
  preferredTimeToRevenue?: TimeToRevenue
  notes?: string
}

export type IdeaFilters = {
  industries?: string[]
  businessModels?: string[]
  capitalRequired?: CapitalRequired[]
  difficulty?: Difficulty[]
  timeToRevenue?: TimeToRevenue[]
  minSoloFounderFit?: number
  minAiLeverage?: number
  minB2bFit?: number
}

export type IdeaSearchInput = {
  query: string
  filters?: IdeaFilters
  profile?: UserIdeaProfile
  limit?: number
}

export type IdeaSearchResult = {
  idea: BusinessIdea
  score: number
  fitReason?: string
  matchedEvidence: IdeaEvidence[]
}

export type RepositoryHealth = {
  storage: 'sample' | 'd1-r2'
  ideaCount: number
}
