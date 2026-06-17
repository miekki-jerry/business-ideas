import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chunkTranscript, type TranscriptSegment } from './chunk-transcript'

type MatchedVideo = {
  index: number
  title: string
  pageUrl: string
  youtubeId?: string
  youtubeUrl?: string
  youtubeTitle?: string
  channel?: string
  matchStatus: 'matched' | 'missing'
}

type PreparedTranscript = MatchedVideo & {
  sourceItemId?: string
  transcriptStatus: 'available' | 'unavailable'
}

type CatalogSourceItem = {
  id: string
  sourceId: string
  url: string
  externalId?: string
}

type ReviewedMfmIdea = {
  sourceItemId?: string
  sourcePageUrl?: string
  youtubeId?: string
}

type Json3Caption = {
  events?: Array<{
    tStartMs?: number
    dDurationMs?: number
    segs?: Array<{ utf8?: string }>
  }>
}

const transcriptDir = '.private/transcripts/mfm'
const rawDir = join(transcriptDir, 'raw')
const segmentsDir = join(transcriptDir, 'segments')
const chunksDir = join(transcriptDir, 'chunks')

export function prepareMfmTranscripts() {
  const matches = readJson<MatchedVideo[]>(join(transcriptDir, 'matched-videos.json'))
  const knownSourceItemIds = loadKnownSourceItemIds()
  mkdirSync(segmentsDir, { recursive: true })
  mkdirSync(chunksDir, { recursive: true })

  const prepared = matches.map((match) => {
    const rawPath = match.youtubeId ? findRawCaption(match.index, match.youtubeId) : null
    const existingSourceItemId = findKnownSourceItemId(match, knownSourceItemIds)

    if (!match.youtubeId || !match.youtubeUrl || !rawPath) {
      return {
        ...match,
        sourceItemId: existingSourceItemId,
        transcriptStatus: 'unavailable' as const,
        reason: match.youtubeId ? 'caption_missing' : 'youtube_match_missing',
      }
    }

    const segments = parseJson3Caption(readJson<Json3Caption>(rawPath))
    const sourceItemId =
      existingSourceItemId ?? `source_item_mfm_${String(match.index).padStart(2, '0')}_${slugify(match.title).slice(0, 48)}`
    const chunks = chunkTranscript({
      sourceItemId,
      sourceUrl: match.youtubeUrl,
      segments,
      targetSeconds: 90,
    })

    const segmentPath = join(segmentsDir, `${sourceItemId}.json`)
    const chunkPath = join(chunksDir, `${sourceItemId}.json`)
    writeFileSync(segmentPath, JSON.stringify(segments, null, 2))
    writeFileSync(chunkPath, JSON.stringify(chunks, null, 2))

    return {
      ...match,
      sourceItemId,
      transcriptStatus: 'available' as const,
      segmentCount: segments.length,
      chunkCount: chunks.length,
      segmentPath,
      chunkPath,
    }
  })

  writeFileSync(join(transcriptDir, 'prepared-transcripts.json'), JSON.stringify(prepared, null, 2))
  return prepared
}

function loadKnownSourceItemIds() {
  const byPageUrl = new Map<string, string>()
  const byYoutubeId = new Map<string, string>()
  const byYoutubeUrl = new Map<string, string>()

  if (existsSync(join(transcriptDir, 'prepared-transcripts.json'))) {
    for (const item of readJson<PreparedTranscript[]>(join(transcriptDir, 'prepared-transcripts.json'))) {
      rememberKnownSourceItem({ byPageUrl, byYoutubeId, byYoutubeUrl }, item.sourceItemId, item.pageUrl, item.youtubeId, item.youtubeUrl)
    }
  }

  if (existsSync('.private/r2/source-items.json')) {
    for (const item of readJson<CatalogSourceItem[]>('.private/r2/source-items.json').filter((sourceItem) => sourceItem.sourceId === 'source_mfm')) {
      rememberKnownSourceItem({ byPageUrl, byYoutubeId, byYoutubeUrl }, item.id, undefined, item.externalId, item.url)
    }
  }

  if (existsSync('.private/extractions/mfm/mfm-reviewed-ideas.json')) {
    for (const idea of readJson<ReviewedMfmIdea[]>('.private/extractions/mfm/mfm-reviewed-ideas.json')) {
      rememberKnownSourceItem({ byPageUrl, byYoutubeId, byYoutubeUrl }, idea.sourceItemId, idea.sourcePageUrl, idea.youtubeId)
    }
  }

  return { byPageUrl, byYoutubeId, byYoutubeUrl }
}

function rememberKnownSourceItem(
  maps: { byPageUrl: Map<string, string>; byYoutubeId: Map<string, string>; byYoutubeUrl: Map<string, string> },
  sourceItemId?: string,
  pageUrl?: string,
  youtubeId?: string,
  youtubeUrl?: string,
) {
  if (!sourceItemId) return
  if (pageUrl) maps.byPageUrl.set(pageUrl, sourceItemId)
  if (youtubeId) maps.byYoutubeId.set(youtubeId, sourceItemId)
  if (youtubeUrl) maps.byYoutubeUrl.set(youtubeUrl, sourceItemId)
}

function findKnownSourceItemId(
  match: MatchedVideo,
  known: { byPageUrl: Map<string, string>; byYoutubeId: Map<string, string>; byYoutubeUrl: Map<string, string> },
) {
  return (
    (match.youtubeId ? known.byYoutubeId.get(match.youtubeId) : undefined) ??
    (match.youtubeUrl ? known.byYoutubeUrl.get(match.youtubeUrl) : undefined) ??
    known.byPageUrl.get(match.pageUrl)
  )
}

function parseJson3Caption(caption: Json3Caption): TranscriptSegment[] {
  return (caption.events ?? [])
    .filter((event) => event.segs?.length && typeof event.tStartMs === 'number')
    .map((event) => {
      const text = (event.segs ?? [])
        .map((segment) => segment.utf8 ?? '')
        .join('')
        .replace(/\s+/g, ' ')
        .trim()

      return {
        startSec: Math.max(0, Math.round((event.tStartMs ?? 0) / 1000)),
        endSec: Math.max(0, Math.round(((event.tStartMs ?? 0) + (event.dDurationMs ?? 0)) / 1000)),
        text,
      }
    })
    .filter((segment) => segment.text.length > 0)
}

function findRawCaption(index: number, youtubeId: string) {
  const prefix = `${String(index).padStart(2, '0')}-${youtubeId}`
  const file = existsSync(rawDir) ? readdirSync(rawDir).find((name) => name.startsWith(prefix) && name.endsWith('.json3')) : undefined
  return file ? join(rawDir, file) : null
}

function readJson<T>(path: string) {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const prepared = prepareMfmTranscripts()
  const available = prepared.filter((item) => item.transcriptStatus === 'available').length
  console.log(`Prepared ${available}/${prepared.length} MFM transcripts`)
}
