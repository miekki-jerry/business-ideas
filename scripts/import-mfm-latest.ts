import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const episodesUrl = 'https://www.mfmpod.com/episodes/'

export type MfmEpisode = {
  title: string
  url: string
  publishedAt?: string
  transcriptStatus: 'available' | 'unavailable' | 'pending'
}

export function parseMfmEpisodes(html: string, limit = 10): MfmEpisode[] {
  const jsonLdEpisodes = parseJsonLdItemList(html, limit)
  if (jsonLdEpisodes.length > 0) {
    return jsonLdEpisodes
  }

  const links = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
  const episodes: MfmEpisode[] = []
  const seen = new Set<string>()

  for (const [, href, rawTitle] of links) {
    const title = decodeHtml(rawTitle.replace(/<[^>]+>/g, ' '))
    if (!title || title.length < 12 || seen.has(title.toLowerCase())) {
      continue
    }

    if (title === 'My First Million') {
      continue
    }

    if (!/money|business|million|startup|founder|ipo|ai/i.test(title)) {
      continue
    }

    seen.add(title.toLowerCase())
    episodes.push({
      title,
      url: href.startsWith('http') ? href : new URL(href, episodesUrl).toString(),
      transcriptStatus: 'unavailable',
    })

    if (episodes.length >= limit) {
      break
    }
  }

  return episodes
}

function parseJsonLdItemList(html: string, limit: number): MfmEpisode[] {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]

  for (const [, rawJson] of scripts) {
    const parsed = JSON.parse(rawJson) as { '@graph'?: Array<Record<string, unknown>> }
    const itemList = parsed['@graph']?.find((item) => item['@type'] === 'ItemList') as
      | { itemListElement?: Array<{ url?: string; name?: string }> }
      | undefined

    if (!itemList?.itemListElement) {
      continue
    }

    return itemList.itemListElement.slice(0, limit).map((item) => ({
      title: decodeHtml(item.name ?? ''),
      url: item.url ?? episodesUrl,
      transcriptStatus: 'unavailable',
    }))
  }

  return []
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

async function main() {
  const response = await fetch(episodesUrl)
  if (!response.ok) {
    throw new Error(`MFM fetch failed: ${response.status}`)
  }

  const html = await response.text()
  const episodes = parseMfmEpisodes(html)
  mkdirSync('.private/imports', { recursive: true })
  writeFileSync(join('.private/imports', 'mfm-episodes-raw.html'), html)
  writeFileSync(join('.private/imports', 'mfm-latest-episodes.json'), JSON.stringify({ episodesUrl, episodes }, null, 2))
  console.log(`Imported ${episodes.length} MFM episode candidates into .private/imports`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
