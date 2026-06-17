import type { Context } from 'hono'
import { ideaSearchInputSchema, recommendInputSchema } from '@/features/business-ideas/schemas'
import type { BusinessIdea } from '@/features/business-ideas/types'
import type { IdeaSearchProvider } from '@/services/search-provider'
import type { IdeasRepository } from '@/services/repository'

type JsonRpcRequest = {
  jsonrpc?: '2.0'
  id?: string | number | null
  method?: string
  params?: {
    name?: string
    uri?: string
    arguments?: Record<string, unknown>
  }
}

const protocolVersion = '2025-06-18'

const serverInfo = {
  name: 'business-ideas',
  version: '0.1.0',
}

const ideaFilterProperties = {
  industries: {
    type: 'array',
    items: { type: 'string' },
    description: 'Industry labels, matched fuzzily against database values.',
  },
  businessModels: {
    type: 'array',
    items: { type: 'string' },
    description: 'Business model labels, matched fuzzily against database values.',
  },
  capitalRequired: { type: 'array', items: { type: 'string', enum: ['none', 'low', 'medium', 'high'] } },
  difficulty: { type: 'array', items: { type: 'string', enum: ['low', 'medium', 'high'] } },
  timeToRevenue: { type: 'array', items: { type: 'string', enum: ['days', 'weeks', 'months', 'years'] } },
  minSoloFounderFit: { type: 'number', minimum: 0, maximum: 10 },
  minAiLeverage: { type: 'number', minimum: 0, maximum: 10 },
  minB2bFit: { type: 'number', minimum: 0, maximum: 10 },
}

const filterProperties = {
  query: {
    type: 'string',
    description: 'Optional text query across title, summary, customer, solution, source text, industries, and models.',
  },
  ...ideaFilterProperties,
}

const profileProperties = {
  query: { type: 'string' },
  whoAreYou: { type: 'string', description: 'Short profile, e.g. solo founder, agency owner, mobile dev.' },
  skills: { type: 'array', items: { type: 'string' } },
  preferredIndustries: { type: 'array', items: { type: 'string' } },
  dislikedIndustries: { type: 'array', items: { type: 'string' } },
  businessPreference: { type: 'string', enum: ['b2b', 'b2c', 'both'] },
  capitalAvailable: { type: 'string', enum: ['none', 'low', 'medium', 'high'] },
  wantsSoloFounder: { type: 'boolean' },
  wantsAiLeverage: { type: 'boolean' },
  preferredTimeToRevenue: { type: 'string', enum: ['days', 'weeks', 'months', 'years'] },
  notes: { type: 'string' },
}

const tools = [
  {
    name: 'search_business_ideas',
    description: 'Search source-backed business ideas. Returns compact JSON with scores and evidence links.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Natural-language search query. English and Polish terms are accepted.' },
        filters: {
          type: 'object',
          properties: ideaFilterProperties,
          description: 'Optional structured filters. Use these for hard constraints after the text query.',
        },
        profile: {
          type: 'object',
          properties: profileProperties,
          description: 'Optional user profile for fit scoring.',
        },
        limit: { type: 'number', minimum: 1, maximum: 10 },
      },
      required: ['query'],
    },
  },
  {
    name: 'count_business_ideas',
    description: 'Count matching business ideas across the full database. Use for exact count questions before answering.',
    inputSchema: {
      type: 'object',
      properties: filterProperties,
    },
  },
  {
    name: 'list_business_ideas',
    description: 'List matching business ideas across the full database with pagination and compact summaries.',
    inputSchema: {
      type: 'object',
      properties: {
        ...filterProperties,
        limit: { type: 'number', minimum: 1, maximum: 60 },
        offset: { type: 'number', minimum: 0 },
      },
    },
  },
  {
    name: 'get_business_idea',
    description: 'Fetch one business idea by id or slug with compact source evidence.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        slug: { type: 'string' },
      },
    },
  },
  {
    name: 'recommend_business_ideas',
    description: 'Recommend ideas for a profile. Does not return raw transcripts.',
    inputSchema: {
      type: 'object',
      properties: {
        profile: {
          type: 'object',
          properties: profileProperties,
          description: 'Profile of the builder, team, capital constraints, skills, and business preferences.',
          required: ['whoAreYou'],
        },
        limit: { type: 'number', minimum: 1, maximum: 10 },
      },
      required: ['profile'],
    },
  },
  {
    name: 'get_random_business_ideas',
    description: 'Return one random source-backed business idea.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_idea_evidence',
    description: 'Return compact evidence records for one idea by id.',
    inputSchema: {
      type: 'object',
      properties: {
        ideaId: { type: 'string' },
      },
      required: ['ideaId'],
    },
  },
  {
    name: 'get_business_idea_facets',
    description: 'Return available facet values and counts for industries, business models, skills, sources, scores, difficulty, capital, and time to revenue.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'find_similar_business_ideas',
    description: 'Find ideas similar to a known idea id.',
    inputSchema: {
      type: 'object',
      properties: {
        ideaId: { type: 'string' },
        limit: { type: 'number', minimum: 1, maximum: 10 },
      },
      required: ['ideaId'],
    },
  },
  {
    name: 'list_sources',
    description: 'List source catalogs used by the business idea database.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
]

const prompts = [
  {
    name: 'recommend_for_builder_profile',
    description: 'Recommend source-backed ideas for a builder profile and constraints.',
    arguments: [
      {
        name: 'profile',
        description: 'Builder profile, skills, constraints, and preferences.',
        required: true,
      },
    ],
  },
  {
    name: 'compare_business_ideas',
    description: 'Compare a small set of idea IDs by wedge, MVP, distribution, risks, and fit.',
    arguments: [
      {
        name: 'ideaIds',
        description: 'Comma-separated idea IDs or slugs to compare.',
        required: true,
      },
    ],
  },
  {
    name: 'validation_brief',
    description: 'Create a practical validation plan for one source-backed idea.',
    arguments: [
      {
        name: 'idOrSlug',
        description: 'Idea ID or slug.',
        required: true,
      },
    ],
  },
]

export async function handleMcpRequest(
  c: Context,
  repository: IdeasRepository,
  searchProvider: IdeaSearchProvider,
) {
  const request = (await c.req.json().catch(() => null)) as JsonRpcRequest | null

  if (!request) {
    return jsonRpcError(c, null, -32700, 'Invalid JSON', ['Send a JSON-RPC 2.0 request body.'])
  }

  if (request.method === 'initialize') {
    return c.json({
      jsonrpc: '2.0',
      id: request.id ?? null,
      result: {
        protocolVersion,
        capabilities: {
          tools: {
            listChanged: false,
          },
          resources: {
            subscribe: false,
            listChanged: false,
          },
          prompts: {
            listChanged: false,
          },
        },
        serverInfo,
      },
    })
  }

  if (request.method === 'notifications/initialized') {
    return c.body(null, 202)
  }

  if (request.method === 'tools/list') {
    return c.json({
      jsonrpc: '2.0',
      id: request.id ?? null,
      result: { tools },
    })
  }

  if (request.method === 'resources/list') {
    return c.json({
      jsonrpc: '2.0',
      id: request.id ?? null,
      result: { resources: listResources() },
    })
  }

  if (request.method === 'resources/templates/list') {
    return c.json({
      jsonrpc: '2.0',
      id: request.id ?? null,
      result: { resourceTemplates: listResourceTemplates() },
    })
  }

  if (request.method === 'resources/read') {
    try {
      const result = await readResource(request.params?.uri, repository)
      return c.json({
        jsonrpc: '2.0',
        id: request.id ?? null,
        result,
      })
    } catch (error) {
      return jsonRpcError(c, request.id ?? null, -32602, error instanceof Error ? error.message : 'Invalid resource', [
        'Call resources/list to inspect available resource URIs.',
      ])
    }
  }

  if (request.method === 'prompts/list') {
    return c.json({
      jsonrpc: '2.0',
      id: request.id ?? null,
      result: { prompts },
    })
  }

  if (request.method === 'prompts/get') {
    try {
      const result = getPrompt(request.params?.name, request.params?.arguments ?? {})
      return c.json({
        jsonrpc: '2.0',
        id: request.id ?? null,
        result,
      })
    } catch (error) {
      return jsonRpcError(c, request.id ?? null, -32602, error instanceof Error ? error.message : 'Invalid prompt', [
        'Call prompts/list to inspect available prompt names and arguments.',
      ])
    }
  }

  if (request.method !== 'tools/call') {
    return jsonRpcError(c, request.id ?? null, -32601, 'Method not found', [
      'Use initialize, tools/list, tools/call, resources/list, resources/templates/list, resources/read, prompts/list, or prompts/get.',
    ])
  }

  const toolName = request.params?.name
  const args = request.params?.arguments ?? {}

  try {
    const result = await callTool(toolName, args, repository, searchProvider)
    return c.json({
      jsonrpc: '2.0',
      id: request.id ?? null,
      result: {
        content: [{ type: 'text', text: JSON.stringify(result) }],
        structuredContent: result,
      },
    })
  } catch (error) {
    return jsonRpcError(c, request.id ?? null, -32602, error instanceof Error ? error.message : 'Invalid params', [
      'Call tools/list to inspect accepted tool names and schemas.',
      'Keep limits small; this MCP server never returns full transcripts.',
    ])
  }
}

async function callTool(
  toolName: string | undefined,
  args: Record<string, unknown>,
  repository: IdeasRepository,
  searchProvider: IdeaSearchProvider,
) {
  switch (toolName) {
    case 'search_business_ideas': {
      const input = ideaSearchInputSchema.parse({ ...args, limit: Number(args.limit ?? 5) })
      const results = await searchProvider.searchIdeas(input)
      return {
        results: compactResults(results),
        hints: ['Use get_business_idea with an id for full idea details.'],
      }
    }
    case 'count_business_ideas': {
      const ideas = await repository.listIdeas()
      const matches = filterIdeasForMcp(ideas, args)

      return {
        totalDatabaseSize: ideas.length,
        matchedCount: matches.length,
        filters: compactFilterEcho(args),
        sample: matches.slice(0, 10).map(compactIdeaSummary),
        hints: ['Use list_business_ideas with the same filters to inspect matching ideas.'],
      }
    }
    case 'list_business_ideas': {
      const ideas = await repository.listIdeas()
      const matches = filterIdeasForMcp(ideas, args)
      const limit = clampNumber(args.limit, 30, 1, 60)
      const offset = clampNumber(args.offset, 0, 0, Number.MAX_SAFE_INTEGER)
      const page = matches.slice(offset, offset + limit)

      return {
        totalDatabaseSize: ideas.length,
        matchedCount: matches.length,
        offset,
        limit,
        hasMore: offset + limit < matches.length,
        ideas: page.map(compactIdeaSummary),
        hints: ['Use get_business_idea with an id or slug before making detailed recommendations.'],
      }
    }
    case 'get_business_idea': {
      const id = typeof args.id === 'string' ? args.id : undefined
      const slug = typeof args.slug === 'string' ? args.slug : undefined
      const idea = id ? await repository.getIdeaById(id) : slug ? await repository.getIdeaBySlug(slug) : null

      if (!idea) {
        return {
          idea: null,
          recoveryHints: ['Pass either a known id or slug.', 'Use search_business_ideas first if you do not know the id.'],
        }
      }

      return { idea: compactIdea(idea), evidence: idea.evidence.slice(0, 3) }
    }
    case 'recommend_business_ideas': {
      const input = recommendInputSchema.parse({ ...args, limit: Number(args.limit ?? 5) })
      const results = await searchProvider.searchIdeas({
        query: profileToQuery(input.profile),
        profile: input.profile,
        limit: input.limit,
      })
      return {
        results: compactResults(results),
        hints: ['Recommendations are retrieval-backed; treat them as research leads, not business advice.'],
      }
    }
    case 'get_random_business_ideas': {
      const idea = await repository.getRandomIdea()
      return { idea: idea ? compactIdea(idea) : null }
    }
    case 'get_idea_evidence': {
      const ideaId = String(args.ideaId ?? '')
      if (!ideaId) {
        throw new Error('ideaId is required')
      }
      return { evidence: await repository.getEvidence(ideaId) }
    }
    case 'get_business_idea_facets': {
      const ideas = await repository.listIdeas()

      return {
        totalDatabaseSize: ideas.length,
        facets: buildFacets(ideas),
      }
    }
    case 'find_similar_business_ideas': {
      const ideaId = String(args.ideaId ?? '')
      if (!ideaId) {
        throw new Error('ideaId is required')
      }
      const results = await searchProvider.getSimilarIdeas({ ideaId, limit: Number(args.limit ?? 5) })
      return { results: compactResults(results) }
    }
    case 'list_sources':
      return { sources: await repository.listSources() }
    default:
      throw new Error(`Unknown tool: ${toolName ?? 'missing'}`)
  }
}

function compactResults(results: Awaited<ReturnType<IdeaSearchProvider['searchIdeas']>>) {
  return results.map((result) => ({
    id: result.idea.id,
    slug: result.idea.slug,
    title: result.idea.title,
    oneLiner: result.idea.oneLiner,
    score: result.score,
    sourceCount: result.idea.evidence.length,
    fitReason: result.fitReason,
    evidence: result.matchedEvidence.map((evidence) => ({
      sourceTitle: evidence.sourceTitle,
      urlAtTimestamp: evidence.urlAtTimestamp ?? evidence.sourceUrl,
    })),
  }))
}

function compactIdea(idea: Awaited<ReturnType<IdeasRepository['getRandomIdea']>>) {
  if (!idea) {
    return null
  }

  return {
    id: idea.id,
    slug: idea.slug,
    title: idea.title,
    oneLiner: idea.oneLiner,
    summary: idea.summary,
    capitalRequired: idea.capitalRequired,
    difficulty: idea.difficulty,
    timeToRevenue: idea.timeToRevenue,
    soloFounderFit: idea.soloFounderFit,
    aiLeverage: idea.aiLeverage,
    b2bFit: idea.b2bFit,
    sourceConfidence: idea.sourceConfidence,
  }
}

function listResources() {
  return [
    {
      uri: 'business-ideas://overview',
      name: 'Business Ideas database overview',
      description: 'Current public dataset size, source policy, tool guidance, and safety constraints.',
      mimeType: 'text/markdown',
    },
    {
      uri: 'business-ideas://facets',
      name: 'Business Ideas facets',
      description: 'Facet counts for industries, models, skills, sources, scores, difficulty, capital, and time to revenue.',
      mimeType: 'application/json',
    },
  ]
}

function listResourceTemplates() {
  return [
    {
      uriTemplate: 'business-ideas://idea/{id-or-slug}',
      name: 'Business idea by ID or slug',
      description: 'Read compact context for one idea. Replace {id-or-slug} with an idea id or slug.',
      mimeType: 'application/json',
    },
  ]
}

async function readResource(uri: string | undefined, repository: IdeasRepository) {
  if (!uri) {
    throw new Error('Resource uri is required')
  }

  if (uri === 'business-ideas://overview') {
    const health = await repository.health()
    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: [
            '# Business Ideas Knowledge Base',
            '',
            `Public ideas: ${health.ideaCount}`,
            `Storage: ${health.storage}`,
            '',
            'Use this MCP for source-backed idea discovery, comparison, recommendation, and validation planning.',
            'Prefer search/list/count/facets before making recommendations. Use get_business_idea for detailed work.',
            'The public MCP intentionally returns compact evidence, short quotes, and timestamp/source URLs. It does not expose full transcripts.',
          ].join('\n'),
        },
      ],
    }
  }

  if (uri === 'business-ideas://facets') {
    const ideas = await repository.listIdeas()
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            totalDatabaseSize: ideas.length,
            facets: buildFacets(ideas),
          }),
        },
      ],
    }
  }

  const idOrSlug = uri.match(/^business-ideas:\/\/idea\/(.+)$/)?.[1]

  if (idOrSlug) {
    const idea = (await repository.getIdeaById(idOrSlug)) ?? (await repository.getIdeaBySlug(idOrSlug))

    if (!idea) {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              found: false,
              recoveryHints: ['Use search_business_ideas or list_business_ideas to find a valid id or slug.'],
            }),
          },
        ],
      }
    }

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            found: true,
            idea: compactIdea(idea),
            evidence: idea.evidence.slice(0, 3),
          }),
        },
      ],
    }
  }

  throw new Error(`Unknown resource: ${uri}`)
}

function getPrompt(name: string | undefined, args: Record<string, unknown>) {
  switch (name) {
    case 'recommend_for_builder_profile': {
      const profile = typeof args.profile === 'string' ? args.profile : JSON.stringify(args.profile ?? {})
      return {
        description: 'Recommend source-backed business ideas for a builder profile.',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                'Use the Business Ideas MCP to recommend 5 source-backed ideas for this builder profile.',
                'First call recommend_business_ideas or search_business_ideas, then use get_business_idea for the strongest candidates.',
                'For each recommendation include: why it fits, smallest MVP, first customers, monetization, main risk, and source URL.',
                '',
                `Profile: ${profile}`,
              ].join('\n'),
            },
          },
        ],
      }
    }
    case 'compare_business_ideas': {
      return {
        description: 'Compare source-backed business ideas.',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Compare these business ideas: ${String(args.ideaIds ?? '')}.`,
                'Use get_business_idea for each ID or slug. Compare wedge, MVP, first customers, distribution, monetization, risks, solo-founder fit, AI leverage, and source confidence.',
                'End with a practical recommendation and cite idea IDs plus source URLs.',
              ].join('\n'),
            },
          },
        ],
      }
    }
    case 'validation_brief': {
      return {
        description: 'Create a validation brief for one source-backed idea.',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Create a validation brief for this idea: ${String(args.idOrSlug ?? '')}.`,
                'Use get_business_idea first. Include target customer, painful trigger, riskiest assumption, no-code/manual MVP, 10 first-customer channels, interview questions, pricing test, and a 7-day validation plan.',
                'Do not invent source claims. Include source evidence URLs.',
              ].join('\n'),
            },
          },
        ],
      }
    }
    default:
      throw new Error(`Unknown prompt: ${name ?? 'missing'}`)
  }
}

function compactIdeaSummary(idea: BusinessIdea) {
  return {
    id: idea.id,
    slug: idea.slug,
    title: idea.title,
    oneLiner: idea.oneLiner,
    targetCustomer: idea.targetCustomer,
    industries: idea.industries,
    businessModels: idea.businessModels,
    capitalRequired: idea.capitalRequired,
    difficulty: idea.difficulty,
    timeToRevenue: idea.timeToRevenue,
    soloFounderFit: idea.soloFounderFit,
    aiLeverage: idea.aiLeverage,
    b2bFit: idea.b2bFit,
    sourceConfidence: idea.sourceConfidence,
    source: sourceLabel(idea),
  }
}

function profileToQuery(profile: { whoAreYou?: string; skills?: string[]; notes?: string }) {
  return [profile.whoAreYou, profile.skills?.join(' '), profile.notes].filter(Boolean).join(' ') || 'business ideas'
}

function filterIdeasForMcp(ideas: BusinessIdea[], filters: Record<string, unknown>) {
  const queryTokens = typeof filters.query === 'string'
    ? normalizeText(filters.query).split(/\s+/).filter(Boolean)
    : []

  return ideas
    .filter((idea) => {
      if (queryTokens.length > 0 && !matchesQueryTokens(searchText(idea), queryTokens)) {
        return false
      }

      if (!matchesStringArrayFilter(idea.industries, filters.industries)) {
        return false
      }

      if (!matchesStringArrayFilter(idea.businessModels, filters.businessModels)) {
        return false
      }

      if (!matchesScalarArrayFilter(idea.capitalRequired, filters.capitalRequired)) {
        return false
      }

      if (!matchesScalarArrayFilter(idea.difficulty, filters.difficulty)) {
        return false
      }

      if (!matchesScalarArrayFilter(idea.timeToRevenue, filters.timeToRevenue)) {
        return false
      }

      if (typeof filters.minSoloFounderFit === 'number' && idea.soloFounderFit < filters.minSoloFounderFit) {
        return false
      }

      if (typeof filters.minAiLeverage === 'number' && idea.aiLeverage < filters.minAiLeverage) {
        return false
      }

      if (typeof filters.minB2bFit === 'number' && idea.b2bFit < filters.minB2bFit) {
        return false
      }

      return true
    })
    .sort((a, b) => b.sourceConfidence - a.sourceConfidence || b.aiLeverage - a.aiLeverage || a.title.localeCompare(b.title))
}

function matchesQueryTokens(value: string, queryTokens: string[]) {
  const normalized = normalizeText(value)
  return queryTokens.every((token) => normalized.includes(token))
}

function compactFilterEcho(filters: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== ''))
}

function matchesStringArrayFilter(values: string[], filter: unknown) {
  if (!Array.isArray(filter) || filter.length === 0) {
    return true
  }

  const normalizedValues = values.map(normalizeText)
  return filter.some((item) => {
    const normalizedFilter = normalizeText(String(item))
    return normalizedValues.some((value) => value.includes(normalizedFilter) || normalizedFilter.includes(value))
  })
}

function matchesScalarArrayFilter(value: string, filter: unknown) {
  if (!Array.isArray(filter) || filter.length === 0) {
    return true
  }

  return filter.map(String).includes(value)
}

function countFacet(values: string[]) {
  const counts = new Map<string, number>()

  for (const value of values) {
    const normalized = value.trim()

    if (!normalized) {
      continue
    }

    counts.set(normalized, (counts.get(normalized) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 50)
    .map(([value, count]) => ({ value, count }))
}

function buildFacets(ideas: BusinessIdea[]) {
  return {
    industries: countFacet(ideas.flatMap((idea) => idea.industries)),
    businessModels: countFacet(ideas.flatMap((idea) => idea.businessModels)),
    skills: countFacet(ideas.flatMap((idea) => idea.skillsRequired)),
    sources: countFacet(ideas.map((idea) => sourceLabel(idea))),
    capitalRequired: countFacet(ideas.map((idea) => idea.capitalRequired)),
    difficulty: countFacet(ideas.map((idea) => idea.difficulty)),
    timeToRevenue: countFacet(ideas.map((idea) => idea.timeToRevenue)),
    soloFounderFit: countFacet(ideas.map((idea) => String(idea.soloFounderFit))),
    aiLeverage: countFacet(ideas.map((idea) => String(idea.aiLeverage))),
    b2bFit: countFacet(ideas.map((idea) => String(idea.b2bFit))),
  }
}

function clampNumber(value: unknown, fallback: number, min: number, max: number) {
  const number = typeof value === 'number' ? value : Number(value)

  if (!Number.isFinite(number)) {
    return fallback
  }

  return Math.min(max, Math.max(min, Math.trunc(number)))
}

function sourceLabel(idea: BusinessIdea) {
  const source = idea.evidence
    .flatMap((item) => [item.sourceTitle, item.sourceType, item.sourceUrl, item.urlAtTimestamp])
    .filter(Boolean)
    .join(' ')

  if (/reddit/i.test(source)) {
    return 'Reddit'
  }

  if (/youtube|youtu\.be|\byt\b/i.test(source)) {
    return 'YouTube'
  }

  if (/podcast|transcript|my first million|\bmfm\b/i.test(source)) {
    return 'Podcast'
  }

  if (/indie|hacker/i.test(source)) {
    return 'Indie Hackers'
  }

  return 'Document'
}

function searchText(idea: BusinessIdea) {
  return [
    idea.title,
    idea.oneLiner,
    idea.summary,
    idea.problem,
    idea.targetCustomer,
    idea.solution,
    idea.monetization,
    idea.industries.join(' '),
    idea.businessModels.join(' '),
    idea.skillsRequired.join(' '),
    idea.distributionChannels.join(' '),
    idea.evidence
      .flatMap((item) => [item.sourceTitle, item.sourceType, item.sourceUrl, item.urlAtTimestamp, item.quote, item.reason])
      .filter(Boolean)
      .join(' '),
  ]
    .filter(Boolean)
    .join(' ')
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function jsonRpcError(c: Context, id: JsonRpcRequest['id'], code: number, message: string, recoveryHints: string[]) {
  return c.json({
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      data: { recoveryHints },
    },
  })
}
