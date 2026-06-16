import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const sourceUrl = 'https://offers.hubspot.com/view/mfm-business-idea'

export type HubspotIdeaRow = {
  title: string
  description?: string
  category?: string
  useCase?: string
  episodeUrl?: string
  sourceUrl: string
}

export function parseHubspotIdeas(html: string): HubspotIdeaRow[] {
  const cardsJson = extractJsonArrayAfterKey(html, '"cards"')
  if (!cardsJson) {
    return []
  }

  const cards = JSON.parse(cardsJson) as Array<{
    title?: string
    description?: string
    filters?: { filter1?: string[]; filter2?: string[] }
    cta?: Array<{ link?: { url?: { href?: string; href_with_scheme?: string } } }>
  }>

  return cards
    .filter((card) => card.title)
    .map((card) => ({
      title: decodeHtml(card.title ?? ''),
      description: decodeHtml(card.description ?? ''),
      category: card.filters?.filter1?.[0],
      useCase: card.filters?.filter2?.join(', '),
      episodeUrl: card.cta?.[0]?.link?.url?.href_with_scheme ?? card.cta?.[0]?.link?.url?.href,
      sourceUrl,
    }))
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

function extractJsonArrayAfterKey(html: string, key: string) {
  const keyIndex = html.indexOf(key)
  if (keyIndex === -1) {
    return null
  }

  const arrayStart = html.indexOf('[', keyIndex)
  if (arrayStart === -1) {
    return null
  }

  let depth = 0
  let inString = false
  let escaped = false

  for (let index = arrayStart; index < html.length; index += 1) {
    const char = html[index]

    if (escaped) {
      escaped = false
      continue
    }

    if (char === '\\') {
      escaped = true
      continue
    }

    if (char === '"') {
      inString = !inString
      continue
    }

    if (inString) {
      continue
    }

    if (char === '[') {
      depth += 1
    }

    if (char === ']') {
      depth -= 1
      if (depth === 0) {
        return html.slice(arrayStart, index + 1)
      }
    }
  }

  return null
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
