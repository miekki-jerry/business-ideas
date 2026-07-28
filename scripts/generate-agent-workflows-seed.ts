import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { agentWorkflows } from '../src/features/agent-workflows/data'

const outputPath = resolve('.private/agent-workflows-seed.sql')
const sql = [
  'begin transaction;',
  'delete from agent_workflows;',
  ...agentWorkflows
    .filter((workflow) => workflow.published)
    .map(
      (workflow) =>
        `insert into agent_workflows (id, slug, category, department, difficulty, maturity, published, content_json, updated_at) values (${[
          workflow.id,
          workflow.slug,
          workflow.category,
          workflow.department.en,
          workflow.difficulty,
          workflow.maturity,
          1,
          JSON.stringify(workflow),
          workflow.updatedAt,
        ]
          .map(sqlValue)
          .join(', ')});`,
    ),
  'commit;',
  '',
].join('\n')

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, sql, 'utf8')
console.log(`Wrote ${agentWorkflows.length} agent workflows to ${outputPath}`)

function sqlValue(value: string | number) {
  return typeof value === 'number' ? String(value) : `'${value.replaceAll("'", "''")}'`
}
