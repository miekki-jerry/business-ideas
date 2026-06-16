import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const sourceUrl = 'https://offers.hubspot.com/view/mfm-business-idea'

export type HubspotIdeaRow = {
  title: string
  category?: string
  useCase?: string
  sourceUrl: string
}

export function parseHubspotIdeas(html: string): HubspotIdeaRow[] {
  const rows = new Map<string, HubspotIdeaRow>()
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  const titleMatches = text.matchAll(/(?:idea|business)[^<]{0,80}?([A-Z][A-Za-z0-9&' -]{6,80})/g)

  for (const match of titleMatches) {
    const title = clean(match[1])
    if (title.length < 6 || title.length > 80 || title.includes('HubSpot')) {
      continue
    }

    rows.set(title.toLowerCase(), { title, sourceUrl })
  }

  return [...rows.values()].slice(0, 200)
}

async function main() {
  const response = await fetch(sourceUrl)
  if (!response.ok) {
    throw new Error(`HubSpot fetch failed: ${response.status}`)
  }

  const html = await response.text()
  const ideas = parseHubspotIdeas(html)
  mkdirSync('.private/imports', { recursive: true })
  writeFileSync(join('.private/imports', 'hubspot-mfm-raw.html'), html)
  writeFileSync(join('.private/imports', 'hubspot-mfm-ideas.json'), JSON.stringify({ sourceUrl, ideas }, null, 2))
  console.log(`Imported ${ideas.length} HubSpot candidate ideas into .private/imports`)
}

function clean(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
