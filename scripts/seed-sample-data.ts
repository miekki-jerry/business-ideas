import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sampleIdeas, sampleSourceItems, sampleSources } from '../src/data/sample-data'
import { ideaToSearchMarkdown } from '../src/lib/markdown'

mkdirSync('.private/r2/ideas', { recursive: true })

for (const idea of sampleIdeas) {
  writeFileSync(join('.private/r2/ideas', `${idea.id}.json`), JSON.stringify(idea, null, 2))
  writeFileSync(join('.private/r2/ideas', `${idea.id}.md`), ideaToSearchMarkdown(idea))
}

writeFileSync(join('.private/r2', 'sources.json'), JSON.stringify(sampleSources, null, 2))
writeFileSync(join('.private/r2', 'source-items.json'), JSON.stringify(sampleSourceItems, null, 2))
console.log(`Seeded ${sampleIdeas.length} sample ideas into .private/r2`)
