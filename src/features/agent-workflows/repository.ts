import { agentWorkflows } from './data'
import type { AgentWorkflow } from './types'

export interface AgentWorkflowsRepository {
  list(): Promise<AgentWorkflow[]>
  getBySlug(slug: string): Promise<AgentWorkflow | null>
}

export function createAgentWorkflowsRepository(db?: D1Database): AgentWorkflowsRepository {
  return db ? new D1AgentWorkflowsRepository(db) : new CommittedAgentWorkflowsRepository()
}

class CommittedAgentWorkflowsRepository implements AgentWorkflowsRepository {
  async list() {
    return agentWorkflows.filter((workflow) => workflow.published)
  }

  async getBySlug(slug: string) {
    return agentWorkflows.find((workflow) => workflow.published && workflow.slug === slug) ?? null
  }
}

class D1AgentWorkflowsRepository implements AgentWorkflowsRepository {
  private readonly fallback = new CommittedAgentWorkflowsRepository()

  constructor(private readonly db: D1Database) {}

  async list() {
    try {
      const rows = await this.db
        .prepare(
          `select content_json
           from agent_workflows
           where published = 1
           order by category asc, slug asc`,
        )
        .all<{ content_json: string }>()

      return rows.results.map(parseWorkflow).filter((workflow): workflow is AgentWorkflow => workflow !== null)
    } catch {
      return this.fallback.list()
    }
  }

  async getBySlug(slug: string) {
    try {
      const row = await this.db
        .prepare(
          `select content_json
           from agent_workflows
           where slug = ? and published = 1
           limit 1`,
        )
        .bind(slug)
        .first<{ content_json: string }>()

      return row ? parseWorkflow(row) : null
    } catch {
      return this.fallback.getBySlug(slug)
    }
  }
}

function parseWorkflow(row: { content_json: string }): AgentWorkflow | null {
  try {
    return JSON.parse(row.content_json) as AgentWorkflow
  } catch {
    return null
  }
}
