import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

type MfmImport = {
  episodes: Array<{
    title: string
    url: string
    publishedAt?: string
  }>
}

type YoutubeEntry = {
  id: string
  title: string
  url?: string
  duration?: number
  duration_string?: string
}

type MatchedVideo = {
  index: number
  title: string
  pageUrl: string
  publishedAt?: string
  youtubeId?: string
  youtubeUrl?: string
  youtubeTitle?: string
  channel: 'My First Million'
  matchStatus: 'matched' | 'missing'
  matchMethod: 'title_similarity' | 'playlist_position'
  matchScore: number
  preferredTranscript: 'auto-en-orig'
  durationSec?: number
  duration?: string
}

const transcriptDir = '.private/transcripts/mfm'

export function matchMfmYoutube(options: { limit?: number } = {}) {
  const imported = readJson<MfmImport>('.private/imports/mfm-latest-episodes.json')
  const limit = options.limit ?? imported.episodes.length
  const videos = fetchYoutubeEntries(Math.max(limit + 10, 50))
  const matches: MatchedVideo[] = imported.episodes.slice(0, limit).map((episode, index) => {
    const byPosition = videos[index]
    const best = bestTitleMatch(episode.title, videos)
    const chosen = best.score >= 0.52 ? best.video : byPosition

    return {
      index: index + 1,
      title: episode.title,
      pageUrl: episode.url,
      publishedAt: episode.publishedAt,
      youtubeId: chosen?.id,
      youtubeUrl: chosen ? `https://www.youtube.com/watch?v=${chosen.id}` : undefined,
      youtubeTitle: chosen?.title,
      channel: 'My First Million',
      matchStatus: chosen ? 'matched' : 'missing',
      matchMethod: best.score >= 0.52 ? 'title_similarity' : 'playlist_position',
      matchScore: chosen ? Math.max(best.score, chosen === byPosition ? 0.5 : 0) : 0,
      preferredTranscript: 'auto-en-orig',
      durationSec: chosen?.duration,
      duration: chosen?.duration_string,
    }
  })

  mkdirSync(transcriptDir, { recursive: true })
  writeFileSync(join(transcriptDir, 'matched-videos.json'), JSON.stringify(matches, null, 2))
  writeFileSync(join(transcriptDir, 'download-captions-all.sh'), buildDownloadScript(matches))
  return matches
}

function fetchYoutubeEntries(limit: number) {
  const output = execFileSync(
    'yt-dlp',
    ['--flat-playlist', '--dump-json', '--playlist-end', String(limit), 'https://www.youtube.com/@MyFirstMillionPod/videos'],
    { encoding: 'utf8', maxBuffer: 1024 * 1024 * 20 },
  )

  return output
    .split(/\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as YoutubeEntry)
}

function bestTitleMatch(title: string, videos: YoutubeEntry[]) {
  let best = { video: undefined as YoutubeEntry | undefined, score: 0 }
  for (const video of videos) {
    const score = jaccard(tokenize(title), tokenize(video.title))
    if (score > best.score) {
      best = { video, score }
    }
  }
  return best
}

function tokenize(value: string) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2 && !['the', 'and', 'you', 'this', 'that', 'how', 'why'].includes(token)),
  )
}

function jaccard(left: Set<string>, right: Set<string>) {
  const union = new Set([...left, ...right])
  if (union.size === 0) return 0
  const intersection = [...left].filter((token) => right.has(token))
  return intersection.length / union.size
}

function buildDownloadScript(matches: MatchedVideo[]) {
  const lines = ['set -e']
  for (const match of matches.filter((item) => item.youtubeId && item.youtubeUrl)) {
    const index = String(match.index).padStart(2, '0')
    const rawPath = `.private/transcripts/mfm/raw/${index}-${match.youtubeId}.%(ext)s`
    lines.push(
      `yt-dlp --skip-download --write-auto-subs --sub-langs en-orig --sub-format json3 -o '${rawPath}' '${match.youtubeUrl}' >/tmp/mfm-caption-${match.youtubeId}.log 2>&1 || true`,
    )
  }
  return `${lines.join('\n')}\n`
}

function readJson<T>(path: string) {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const limitIndex = process.argv.indexOf('--limit')
  const limit = limitIndex === -1 ? undefined : Number(process.argv[limitIndex + 1])
  const matches = matchMfmYoutube({ limit })
  const matched = matches.filter((match) => match.matchStatus === 'matched').length
  console.log(`Matched ${matched}/${matches.length} MFM episodes to YouTube videos`)
}
