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

  it('serves idea by slug', async () => {
    const response = await app.request('/api/business-ideas/ideas/slug/my-ai-tax-guy')
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ idea: { title: 'My AI Tax Guy' } })
  })

  it('lists and calls MCP tools', async () => {
    const listResponse = await app.request('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    })
    expect(listResponse.status).toBe(200)

    const callResponse = await app.request('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: { name: 'search_business_ideas', arguments: { query: 'tax AI', limit: 1 } },
      }),
    })

    expect(callResponse.status).toBe(200)
    const json = (await callResponse.json()) as { result: { structuredContent: { results: unknown[] } } }
    expect(json.result.structuredContent.results).toHaveLength(1)
  })
})
