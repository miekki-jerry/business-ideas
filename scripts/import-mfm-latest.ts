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
  const links = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
  const episodes: MfmEpisode[] = []
  const seen = new Set<string>()

  for (const [, href, rawTitle] of links) {
    const title = rawTitle.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (!title || title.length < 12 || seen.has(title.toLowerCase())) {
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
