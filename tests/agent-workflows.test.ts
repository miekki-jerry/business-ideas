import { describe, expect, it } from 'vitest'
import { agentWorkflows } from '../src/features/agent-workflows/data'
import { createAgentWorkflowsRepository } from '../src/features/agent-workflows/repository'
import { app } from '../src/index'

describe('agent workflows dataset', () => {
  it('contains 100 unique, published workflows', () => {
    expect(agentWorkflows).toHaveLength(100)
    expect(new Set(agentWorkflows.map(({ id }) => id))).toHaveLength(100)
    expect(new Set(agentWorkflows.map(({ slug }) => slug))).toHaveLength(100)
    expect(new Set(agentWorkflows.map(({ title }) => title.en))).toHaveLength(100)
    expect(new Set(agentWorkflows.map(({ title }) => title.pl))).toHaveLength(100)
    expect(agentWorkflows.every(({ published }) => published)).toBe(true)
  })

  it('has complete Polish and English operational content', () => {
    for (const workflow of agentWorkflows) {
      expectLocalized(workflow.title)
      expectLocalized(workflow.oneLiner)
      expectLocalized(workflow.summary)
      expectLocalized(workflow.department)
      expectLocalized(workflow.primaryUser)
      expectLocalized(workflow.benefit)
      expectLocalized(workflow.beforeAgentic)
      expectLocalized(workflow.whyAgentic)
      expectLocalized(workflow.trigger)
      expect(workflow.contexts.length).toBeGreaterThan(0)
      expect(workflow.capabilities.length).toBeGreaterThan(0)
      expect(workflow.complexity).toBeGreaterThanOrEqual(1)
      expect(workflow.complexity).toBeLessThanOrEqual(5)
      expect(workflow.inputs.length).toBeGreaterThanOrEqual(2)
      expect(workflow.agentSteps.length).toBeGreaterThanOrEqual(4)
      expect(workflow.humanCheckpoints.length).toBeGreaterThan(0)
      expect(workflow.outputs.length).toBeGreaterThanOrEqual(2)
      expect(workflow.minimumStack.length).toBeGreaterThanOrEqual(3)
      expect(workflow.tools.length).toBeGreaterThanOrEqual(2)
      expect(workflow.risks.length).toBeGreaterThan(0)
      expect(workflow.guardrails.length).toBeGreaterThanOrEqual(2)

      for (const text of [
        ...workflow.inputs,
        ...workflow.outputs,
        ...workflow.minimumStack,
        ...workflow.guardrails,
        ...workflow.agentSteps.map(({ action }) => action),
        ...workflow.humanCheckpoints.map(({ decision }) => decision),
      ]) {
        expectLocalized(text)
      }
    }

    expect(new Set(agentWorkflows.map(({ complexity }) => complexity))).toEqual(new Set([1, 2, 3, 4, 5]))
  })

  it('uses bounded impact ranges and real HTTP sources', () => {
    for (const workflow of agentWorkflows) {
      expect(workflow.impact.min).toBeGreaterThanOrEqual(0)
      expect(workflow.impact.max).toBeGreaterThanOrEqual(workflow.impact.min)
      expect(workflow.impact.max).toBeLessThanOrEqual(100)
      expectLocalized(workflow.impact.metric)
      expectLocalized(workflow.impact.explanation)
      expect(workflow.sources.length).toBeGreaterThanOrEqual(1)
      expect(workflow.sources.length).toBeLessThanOrEqual(2)

      for (const source of workflow.sources) {
        expect(source.url).toMatch(/^https?:\/\//)
        expect(source.publisher.length).toBeGreaterThan(0)
        expectLocalized(source.claim)
      }
    }
  })

  it('keeps capability filters aligned with the actual workflow', () => {
    const bySlug = new Map(agentWorkflows.map((workflow) => [workflow.slug, workflow]))

    expect(bySlug.get('transcript-to-content-campaign')?.capabilities).not.toContain('transcription')
    expect(bySlug.get('sales-transcript-to-crm-hygiene')?.capabilities).not.toContain('transcription')

    for (const slug of [
      'brand-compliance-review',
      'variance-reporting-with-evidence',
      'litigation-evidence-chronology',
      'payment-exception-resolution',
    ]) {
      expect(bySlug.get(slug)?.capabilities).not.toContain('web-research')
    }

    expect(bySlug.get('brand-compliance-review')?.capabilities).toContain('vision')
    expect(bySlug.get('legacy-access-provisioning')?.whyAgentic.pl).not.toContain('vision')
    expect(bySlug.get('multi-brand-voice-support')?.whyAgentic.pl).not.toContain('vision')
  })
})

describe('agent workflows API', () => {
  it('lists workflows from the committed fallback', async () => {
    const response = await app.request('/api/agent-workflows')
    expect(response.status).toBe(200)
    const json = (await response.json()) as { workflows: Array<{ slug: string }> }
    expect(json.workflows).toHaveLength(100)
    expect(json.workflows.map(({ slug }) => slug)).toContain(agentWorkflows[0]!.slug)
  })

  it('serves a workflow by slug on API and root paths', async () => {
    for (const path of ['/api/agent-workflows/slug/contract-to-finance-data', '/agent-workflows/slug/contract-to-finance-data']) {
      const response = await app.request(path)
      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toMatchObject({ workflow: { slug: 'contract-to-finance-data' } })
    }
  })

  it('returns 404 for an unknown slug', async () => {
    const response = await app.request('/api/agent-workflows/slug/not-a-workflow')
    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toEqual({ error: 'Agent workflow not found' })
  })

  it('applies CORS to the workflows API', async () => {
    const response = await app.request(
      '/api/agent-workflows',
      { headers: { origin: 'https://bogumilluc.pl' } },
      { ALLOWED_ORIGINS: 'https://bogumilluc.pl' },
    )
    expect(response.headers.get('access-control-allow-origin')).toBe('https://bogumilluc.pl')
  })
})

describe('D1 agent workflows repository', () => {
  it('queries published records only for list and detail', async () => {
    const statements: Array<{ sql: string; bindings: unknown[] }> = []
    const db = {
      prepare(sql: string) {
        const statement = { sql, bindings: [] as unknown[] }
        statements.push(statement)
        return {
          bind(...bindings: unknown[]) {
            statement.bindings = bindings
            return this
          },
          all: async () => ({ results: [] }),
          first: async () => null,
        }
      },
    }

    const repository = createAgentWorkflowsRepository(db as unknown as D1Database)
    await repository.list()
    await repository.getBySlug('hidden')

    expect(statements).toHaveLength(2)
    expect(statements[0]!.sql).toMatch(/where published = 1/i)
    expect(statements[1]!.sql).toMatch(/where slug = \? and published = 1/i)
    expect(statements[1]!.bindings).toEqual(['hidden'])
  })
})

function expectLocalized(text: { en: string; pl: string }) {
  expect(text.en.trim().length).toBeGreaterThan(0)
  expect(text.pl.trim().length).toBeGreaterThan(0)
}
