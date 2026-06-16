import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Context } from 'hono'
import type { z } from 'zod'
import { ideaSearchInputSchema, recommendInputSchema } from '@/features/business-ideas/schemas'
import { badRequest, notFound, ok, serverError } from '@/lib/http'
import { handleMcpRequest } from '@/mcp/server'
import { createIdeasRepository, type Env } from '@/services/repository'
import { createSearchProvider } from '@/services/search-provider'

export const app = new Hono<{ Bindings: Env }>()

app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'https://bogumilluc.pl'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['content-type', 'authorization'],
  }),
)

app.get('/api/business-ideas/health', async (c) => {
  const repository = createIdeasRepository(c.env)
  const health = await repository.health()
  return ok(c, {
    ok: true,
    ...health,
    mcp: {
      endpoint: '/mcp',
      transport: 'streamable-http-json-rpc',
    },
  })
})

app.get('/api/business-ideas/random', async (c) => {
  const repository = createIdeasRepository(c.env)
  const idea = await repository.getRandomIdea()
  return idea ? ok(c, { idea }) : notFound(c, 'No ideas available')
})

app.get('/api/business-ideas/ideas/:id', async (c) => {
  const repository = createIdeasRepository(c.env)
  const idea = await repository.getIdeaById(c.req.param('id'))
  return idea ? ok(c, { idea }) : notFound(c, 'Idea not found')
})

app.get('/api/business-ideas/ideas/slug/:slug', async (c) => {
  const repository = createIdeasRepository(c.env)
  const idea = await repository.getIdeaBySlug(c.req.param('slug'))
  return idea ? ok(c, { idea }) : notFound(c, 'Idea not found')
})

app.post('/api/business-ideas/search', async (c) => {
  const parsed = await parseJson(c, ideaSearchInputSchema)
  if (!parsed.ok) {
    return badRequest(c, 'Invalid search input', parsed.error)
  }

  const repository = createIdeasRepository(c.env)
  const searchProvider = createSearchProvider(repository, c.env)
  const results = await searchProvider.searchIdeas(parsed.data)
  return ok(c, { results })
})

app.post('/api/business-ideas/recommend', async (c) => {
  const parsed = await parseJson(c, recommendInputSchema)
  if (!parsed.ok) {
    return badRequest(c, 'Invalid recommendation input', parsed.error)
  }

  const repository = createIdeasRepository(c.env)
  const searchProvider = createSearchProvider(repository, c.env)
  const results = await searchProvider.searchIdeas({
    query: [
      parsed.data.profile.whoAreYou,
      parsed.data.profile.skills?.join(' '),
      parsed.data.profile.notes,
      parsed.data.profile.businessPreference,
    ]
      .filter(Boolean)
      .join(' '),
    profile: parsed.data.profile,
    limit: parsed.data.limit,
  })

  return ok(c, { results })
})

app.get('/api/business-ideas/ideas/:id/evidence', async (c) => {
  const repository = createIdeasRepository(c.env)
  return ok(c, { evidence: await repository.getEvidence(c.req.param('id')) })
})

app.get('/api/business-ideas/ideas/:id/similar', async (c) => {
  const repository = createIdeasRepository(c.env)
  const searchProvider = createSearchProvider(repository, c.env)
  return ok(c, { results: await searchProvider.getSimilarIdeas({ ideaId: c.req.param('id'), limit: 5 }) })
})

app.get('/api/business-ideas/sources', async (c) => {
  const repository = createIdeasRepository(c.env)
  return ok(c, { sources: await repository.listSources() })
})

app.get('/api/business-ideas/sources/:id', async (c) => {
  const repository = createIdeasRepository(c.env)
  const source = await repository.getSource(c.req.param('id'))
  return source ? ok(c, { source }) : notFound(c, 'Source not found')
})

app.post('/mcp', async (c) => {
  const repository = createIdeasRepository(c.env)
  const searchProvider = createSearchProvider(repository, c.env)
  return handleMcpRequest(c, repository, searchProvider)
})

app.notFound((c) => notFound(c, 'Route not found'))
app.onError((error, c) => {
  console.error(error)
  return serverError(c)
})

async function parseJson<T extends z.ZodType>(
  c: Context,
  schema: T,
): Promise<{ ok: true; data: z.infer<T> } | { ok: false; error: unknown }> {
  const body = await c.req.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten() }
  }

  return { ok: true, data: parsed.data }
}

export default app
