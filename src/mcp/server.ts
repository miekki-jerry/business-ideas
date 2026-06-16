import type { Context } from 'hono'
import { ideaSearchInputSchema, recommendInputSchema } from '@/features/business-ideas/schemas'
import type { IdeaSearchProvider } from '@/services/search-provider'
import type { IdeasRepository } from '@/services/repository'

type JsonRpcRequest = {
  jsonrpc?: '2.0'
  id?: string | number | null
  method?: string
  params?: {
    name?: string
    arguments?: Record<string, unknown>
  }
}

const tools = [
  {
    name: 'search_business_ideas',
    description: 'Search source-backed business ideas. Returns compact JSON with scores and evidence links.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        filters: { type: 'object' },
        limit: { type: 'number', minimum: 1, maximum: 10 },
      },
      required: ['query'],
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
        profile: { type: 'object' },
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

export async function handleMcpRequest(
  c: Context,
  repository: IdeasRepository,
  searchProvider: IdeaSearchProvider,
) {
  const request = (await c.req.json().catch(() => null)) as JsonRpcRequest | null

  if (!request) {
    return jsonRpcError(c, null, -32700, 'Invalid JSON', ['Send a JSON-RPC 2.0 request body.'])
  }

  if (request.method === 'tools/list') {
    return c.json({
      jsonrpc: '2.0',
      id: request.id ?? null,
      result: { tools },
    })
  }

  if (request.method !== 'tools/call') {
    return jsonRpcError(c, request.id ?? null, -32601, 'Method not found', ['Use tools/list or tools/call.'])
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

function profileToQuery(profile: { whoAreYou?: string; skills?: string[]; notes?: string }) {
  return [profile.whoAreYou, profile.skills?.join(' '), profile.notes].filter(Boolean).join(' ') || 'business ideas'
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
