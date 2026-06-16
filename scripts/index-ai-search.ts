import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sampleIdeas } from '../src/data/sample-data'
import { ideaToSearchMarkdown } from '../src/lib/markdown'

export function writeSearchDocuments(outDir = '.private/ai-search-documents', catalogIdeasDir = '.private/r2/ideas') {
  rmSync(outDir, { force: true, recursive: true })
  mkdirSync(outDir, { recursive: true })

  if (existsSync(catalogIdeasDir)) {
    const files = readdirSync(catalogIdeasDir).filter((file) => file.endsWith('.md'))
    for (const file of files) {
      copyFileSync(join(catalogIdeasDir, file), join(outDir, file))
    }
    return files.length
  }

  for (const idea of sampleIdeas) {
    writeFileSync(join(outDir, `${idea.id}.md`), ideaToSearchMarkdown(idea))
  }

  return sampleIdeas.length
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const count = writeSearchDocuments()
  console.log(`Wrote ${count} AI Search markdown documents to .private/ai-search-documents`)
}
