import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sampleIdeas } from '../src/data/sample-data'
import { ideaToSearchMarkdown } from '../src/lib/markdown'

export function writeSearchDocuments(outDir = '.private/ai-search-documents') {
  mkdirSync(outDir, { recursive: true })

  for (const idea of sampleIdeas) {
    writeFileSync(join(outDir, `${idea.id}.md`), ideaToSearchMarkdown(idea))
  }

  return sampleIdeas.length
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const count = writeSearchDocuments()
  console.log(`Wrote ${count} AI Search markdown documents to .private/ai-search-documents`)
}
