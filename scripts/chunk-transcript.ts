import { timestampUrl } from '../src/lib/format'

export type TranscriptSegment = {
  startSec: number
  endSec: number
  text: string
}

export type TranscriptChunk = {
  id: string
  sourceItemId: string
  chunkIndex: number
  startSec: number
  endSec: number
  text: string
  urlAtTimestamp?: string
}

export function chunkTranscript(input: {
  sourceItemId: string
  sourceUrl: string
  segments: TranscriptSegment[]
  targetSeconds?: number
}): TranscriptChunk[] {
  const targetSeconds = input.targetSeconds ?? 75
  const chunks: TranscriptChunk[] = []
  let current: TranscriptSegment[] = []

  for (const segment of input.segments) {
    current.push(segment)
    const startSec = current[0].startSec
    const endSec = current[current.length - 1].endSec

    if (endSec - startSec >= targetSeconds) {
      chunks.push(toChunk(input.sourceItemId, input.sourceUrl, chunks.length, current))
      current = []
    }
  }

  if (current.length > 0) {
    chunks.push(toChunk(input.sourceItemId, input.sourceUrl, chunks.length, current))
  }

  return chunks
}

function toChunk(sourceItemId: string, sourceUrl: string, chunkIndex: number, segments: TranscriptSegment[]): TranscriptChunk {
  const startSec = segments[0].startSec
  const endSec = segments[segments.length - 1].endSec

  return {
    id: `${sourceItemId}_chunk_${chunkIndex.toString().padStart(4, '0')}`,
    sourceItemId,
    chunkIndex,
    startSec,
    endSec,
    text: segments.map((segment) => segment.text).join(' '),
    urlAtTimestamp: timestampUrl(sourceUrl, startSec),
  }
}
