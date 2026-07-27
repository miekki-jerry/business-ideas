import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chunkTranscript, type TranscriptSegment } from './chunk-transcript'

type FlatVideo = {
  id: string
  title: string
  url?: string
  duration?: number
}

type FlatChannel = {
  id: string
  channel: string
  channel_id: string
  webpage_url: string
  entries: FlatVideo[]
}

type VideoInfo = {
  id: string
  title: string
  description?: string
  duration?: number
  upload_date?: string
  timestamp?: number
  channel?: string
  channel_id?: string
  tags?: string[]
  categories?: string[]
  view_count?: number
  like_count?: number
  availability?: string
  webpage_url?: string
}

type Json3Caption = {
  events?: Array<{
    tStartMs?: number
    dDurationMs?: number
    segs?: Array<{ utf8?: string }>
  }>
}

const sourceId = 'source_starter_story_youtube'
const rootDir = '.private/transcripts/starter-story'
const rawDir = join(rootDir, 'raw')
const chunksDir = join(rootDir, 'chunks')
const manifestPath = '.private/imports/starter-story-youtube.json'

export function prepareStarterStory() {
  const channel = readJson<FlatChannel>('.private/imports/starter-story-channel-flat.json')
  mkdirSync(chunksDir, { recursive: true })

  const seen = new Set<string>()
  const videos = channel.entries.map((flat, index) => {
    if (!flat.id || seen.has(flat.id)) {
      throw new Error(`Duplicate or missing Starter Story video id at index ${index}`)
    }
    seen.add(flat.id)

    const infoPath = join(rawDir, `${flat.id}.info.json`)
    const info = existsSync(infoPath) ? readJson<VideoInfo>(infoPath) : undefined
    const captionPath = findCaption(flat.id)
    const sourceItemId = `source_item_starter_story_youtube_${flat.id}`
    const url = `https://www.youtube.com/watch?v=${flat.id}`
    const chunkPath = join(chunksDir, `${sourceItemId}.json`)

    if (captionPath) {
      const segments = parseJson3Caption(readJson<Json3Caption>(captionPath))
      writeFileSync(
        chunkPath,
        JSON.stringify(chunkTranscript({ sourceItemId, sourceUrl: url, segments, targetSeconds: 120 }), null, 2),
      )
    }

    return {
      index: index + 1,
      id: sourceItemId,
      sourceId,
      externalId: flat.id,
      title: info?.title ?? flat.title,
      url,
      publishedAt: toPublishedAt(info),
      durationSec: info?.duration ?? flat.duration,
      language: 'en',
      transcriptStatus: captionPath ? ('available' as const) : ('unavailable' as const),
      chunkPath: captionPath ? chunkPath : undefined,
      metadata: {
        channel: info?.channel ?? channel.channel,
        channelId: info?.channel_id ?? channel.channel_id,
        description: info?.description,
        tags: info?.tags ?? [],
        categories: info?.categories ?? [],
        viewCount: info?.view_count,
        likeCount: info?.like_count,
        availability: info?.availability,
      },
    }
  })

  const manifest = {
    source: {
      id: sourceId,
      type: 'youtube' as const,
      name: 'Starter Story YouTube',
      url: 'https://www.youtube.com/@starterstory/videos',
      author: 'Starter Story',
      description: 'Long-form Starter Story YouTube videos about founders, business models, revenue, and growth.',
    },
    channelId: channel.channel_id,
    expectedVideoCount: channel.entries.length,
    videos,
  }
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  return manifest
}

function findCaption(videoId: string) {
  const files = existsSync(rawDir) ? readdirSync(rawDir) : []
  for (const suffix of ['.en-orig.json3', '.en.json3']) {
    const name = `${videoId}${suffix}`
    if (files.includes(name)) return join(rawDir, name)
  }
  return undefined
}

function parseJson3Caption(caption: Json3Caption): TranscriptSegment[] {
  return (caption.events ?? [])
    .filter((event) => event.segs?.length && typeof event.tStartMs === 'number')
    .map((event) => ({
      startSec: Math.max(0, Math.round((event.tStartMs ?? 0) / 1000)),
      endSec: Math.max(0, Math.round(((event.tStartMs ?? 0) + (event.dDurationMs ?? 0)) / 1000)),
      text: (event.segs ?? [])
        .map((segment) => segment.utf8 ?? '')
        .join('')
        .replace(/\s+/g, ' ')
        .trim(),
    }))
    .filter((segment) => segment.text.length > 0)
}

function toPublishedAt(info?: VideoInfo) {
  if (info?.timestamp) return new Date(info.timestamp * 1000).toISOString()
  if (!info?.upload_date || !/^\d{8}$/.test(info.upload_date)) return undefined
  const value = info.upload_date
  return new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T00:00:00.000Z`).toISOString()
}

function readJson<T>(path: string) {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const manifest = prepareStarterStory()
  const available = manifest.videos.filter((video) => video.transcriptStatus === 'available').length
  console.log(`Prepared ${manifest.videos.length} Starter Story videos; ${available} transcripts available`)
}
