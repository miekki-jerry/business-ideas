import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

type SourceCandidate = {
  title: string
  creator?: string
  url: string
  sourceType?: string
  reason?: string
  priority?: 'P0' | 'P1' | 'P2' | string
  likelyIdeaDensity?: string
  transcriptLikely?: boolean
  notes?: string
}

const inputPath = '.private/agent-source-research/candidates.json'
const outDir = '.private/ai-search-source-candidates'

export function writeSourceCandidateDocuments(input = inputPath, output = outDir) {
  if (!existsSync(input)) {
    throw new Error(`Missing source candidates file: ${input}`)
  }

  const candidates = readCandidates(input)
  rmSync(output, { force: true, recursive: true })
  mkdirSync(output, { recursive: true })

  for (const [index, candidate] of candidates.entries()) {
    writeFileSync(join(output, `${String(index + 1).padStart(3, '0')}-${slugify(candidate.title)}.md`), toMarkdown(candidate))
  }

  return candidates.length
}

function readCandidates(path: string) {
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as SourceCandidate[] | { candidates?: SourceCandidate[] }
  return Array.isArray(parsed) ? parsed : (parsed.candidates ?? [])
}

function toMarkdown(candidate: SourceCandidate) {
  return `---
type: source_candidate
source_type: ${candidate.sourceType ?? 'unknown'}
priority: ${candidate.priority ?? 'unknown'}
likely_idea_density: ${candidate.likelyIdeaDensity ?? 'unknown'}
transcript_likely: ${candidate.transcriptLikely ? 'true' : 'false'}
---
# ${candidate.title}

Creator:
${candidate.creator ?? 'Unknown'}

URL:
${candidate.url}

Reason:
${candidate.reason ?? ''}

Notes:
${candidate.notes ?? ''}
`
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const count = writeSourceCandidateDocuments()
  console.log(`Wrote ${count} AI Search source candidate documents to ${outDir}`)
}
