import { describe, expect, it } from 'vitest'
import { app } from '../src/index'

describe('business ideas worker', () => {
  it('returns health with sample storage', async () => {
    const response = await app.request('/api/business-ideas/health')
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ ok: true, storage: 'sample', ideaCount: 3 })
  })

  it('searches ideas', async () => {
    const response = await app.request('/api/business-ideas/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: 'solo B2B AI low capital',
        filters: { minSoloFounderFit: 7, minAiLeverage: 7 },
        limit: 2,
      }),
    })

    expect(response.status).toBe(200)
    const json = (await response.json()) as { results: unknown[] }
    expect(json.results.length).toBeGreaterThan(0)
  })

  it('ignores non-idea AI Search documents', async () => {
    const response = await app.request(
      '/api/business-ideas/search',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: 'unusual consultant workflow', limit: 1 }),
      },
      {
        BUSINESS_IDEAS_SEARCH: {
          search: async () => ({
            data: [
              { item: { key: 'source-candidates/research-note.md' }, score: 0.99 },
              { item: { key: 'ideas/idea_my_ai_tax_guy.md' }, score: 0.98 },
            ],
          }),
        },
      },
    )

    expect(response.status).toBe(200)
    const json = (await response.json()) as { results: Array<{ idea: { id: string } }> }
    expect(json.results).toHaveLength(1)
    expect(json.results[0]?.idea.id).toBe('idea_my_ai_tax_guy')
  })

  it('expands Polish queries before calling AI Search', async () => {
    let searchQuery = ''
    const response = await app.request(
      '/api/business-ideas/search',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: 'gry', limit: 1 }),
      },
      {
        BUSINESS_IDEAS_SEARCH: {
          search: async (input) => {
            searchQuery = String(input.query)
            return { data: [{ item: { key: 'ideas/idea_ai_phone_agents_local_businesses.md' }, score: 0.7 }] }
          },
        },
      },
    )

    expect(response.status).toBe(200)
    expect(searchQuery).toContain('games')
    expect(searchQuery).toContain('gaming')
  })

  it('reads new AI Search chunks response shape', async () => {
    const response = await app.request(
      '/api/business-ideas/search',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: 'local phone agent', limit: 1 }),
      },
      {
        BUSINESS_IDEAS_SEARCH: {
          search: async () => ({
            chunks: [{ item: { key: 'ideas/idea_ai_phone_agents_local_businesses.md' }, score: 0.91 }],
          }),
        },
      },
    )

    expect(response.status).toBe(200)
    const json = (await response.json()) as { results: Array<{ idea: { id: string } }> }
    expect(json.results[0]?.idea.id).toBe('idea_ai_phone_agents_local_businesses')
  })

  it('accepts larger search result limits for lazy loading', async () => {
    const response = await app.request('/api/business-ideas/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: 'AI', limit: 200 }),
    })

    expect(response.status).toBe(200)
  })

  it('lists ideas', async () => {
    const response = await app.request('/api/business-ideas/ideas')
    expect(response.status).toBe(200)
    const json = (await response.json()) as { ideas: unknown[] }
    expect(json.ideas.length).toBeGreaterThan(0)
  })

  it('serves idea by slug', async () => {
    const response = await app.request('/api/business-ideas/ideas/slug/my-ai-tax-guy')
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ idea: { title: 'My AI Tax Guy' } })
  })

  it('initializes, lists, and calls MCP tools', async () => {
    const initializeResponse = await app.request('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 'worker-test', version: '0.0.0' },
        },
      }),
    })
    expect(initializeResponse.status).toBe(200)
    await expect(initializeResponse.json()).resolves.toMatchObject({
      jsonrpc: '2.0',
      id: 1,
      result: {
        protocolVersion: '2025-06-18',
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'business-ideas' },
      },
    })

    const initializedResponse = await app.request('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
    })
    expect(initializedResponse.status).toBe(202)

    const listResponse = await app.request('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' }),
    })
    expect(listResponse.status).toBe(200)

    const callResponse = await app.request('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: { name: 'search_business_ideas', arguments: { query: 'tax AI', limit: 1 } },
      }),
    })

    expect(callResponse.status).toBe(200)
    const json = (await callResponse.json()) as { result: { structuredContent: { results: unknown[] } } }
    expect(json.result.structuredContent.results).toHaveLength(1)
  })

  it('counts, lists, and facets ideas through MCP', async () => {
    const countResponse = await app.request('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'count_business_ideas',
          arguments: { capitalRequired: ['low'], minAiLeverage: 7 },
        },
      }),
    })
    expect(countResponse.status).toBe(200)
    const countJson = (await countResponse.json()) as { result: { structuredContent: { matchedCount: number } } }
    expect(countJson.result.structuredContent.matchedCount).toBe(1)

    const listResponse = await app.request('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'list_business_ideas',
          arguments: { industries: ['home services'], limit: 1 },
        },
      }),
    })
    expect(listResponse.status).toBe(200)
    const listJson = (await listResponse.json()) as {
      result: { structuredContent: { matchedCount: number; hasMore: boolean; ideas: Array<{ id: string }> } }
    }
    expect(listJson.result.structuredContent.matchedCount).toBe(2)
    expect(listJson.result.structuredContent.hasMore).toBe(true)
    expect(listJson.result.structuredContent.ideas).toHaveLength(1)

    const facetsResponse = await app.request('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: { name: 'get_business_idea_facets', arguments: {} },
      }),
    })
    expect(facetsResponse.status).toBe(200)
    const facetsJson = (await facetsResponse.json()) as {
      result: { structuredContent: { facets: { industries: Array<{ value: string; count: number }> } } }
    }
    expect(facetsJson.result.structuredContent.facets.industries).toContainEqual({ value: 'home services', count: 2 })
  })
})
