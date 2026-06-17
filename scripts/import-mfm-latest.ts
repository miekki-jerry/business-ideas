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

export function parseMfmRssEpisodes(xml: string, limit = 40): MfmEpisode[] {
  return [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)].slice(0, limit).map((match) => {
    const item = match[0]
    const title = decodeHtml(readTag(item, 'title'))
    const pubDate = readTag(item, 'pubDate')

    return {
      title,
      url: new URL(`/${slugifyForUrl(title)}/`, episodesUrl).toString(),
      publishedAt: pubDate ? new Date(pubDate).toISOString() : undefined,
      transcriptStatus: 'unavailable',
    }
  })
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
  const args = parseArgs(process.argv.slice(2))
  const limit = args.limit ?? 10
  const source = args.source ?? 'html'
  const importUrl = source === 'rss' ? 'https://feeds.megaphone.fm/HS2300184645' : episodesUrl
  const response = await fetch(importUrl)
  if (!response.ok) {
    throw new Error(`MFM fetch failed: ${response.status}`)
  }

  const body = await response.text()
  const episodes = source === 'rss' ? parseMfmRssEpisodes(body, limit) : parseMfmEpisodes(body, limit)
  mkdirSync('.private/imports', { recursive: true })
  writeFileSync(join('.private/imports', source === 'rss' ? 'mfm-episodes-raw.xml' : 'mfm-episodes-raw.html'), body)
  writeFileSync(join('.private/imports', 'mfm-latest-episodes.json'), JSON.stringify({ episodesUrl, episodes }, null, 2))
  console.log(`Imported ${episodes.length} MFM episode candidates into .private/imports`)
}

function readTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
  return match ? match[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : ''
}

function slugifyForUrl(value: string) {
  return decodeHtml(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/["'“”‘’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseArgs(args: string[]) {
  const parsed: { limit?: number; source?: 'html' | 'rss' } = {}

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--limit') {
      parsed.limit = Number(args[index + 1])
      index += 1
    }
    if (arg === '--source') {
      const source = args[index + 1]
      if (source !== 'html' && source !== 'rss') {
        throw new Error(`Unsupported MFM source: ${source}`)
      }
      parsed.source = source
      index += 1
    }
  }

  return parsed
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
