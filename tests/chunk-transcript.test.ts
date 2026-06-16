import { describe, expect, it } from 'vitest'
import { chunkTranscript } from '../scripts/chunk-transcript'

describe('chunkTranscript', () => {
  it('groups segments into timestamped chunks', () => {
    const chunks = chunkTranscript({
      sourceItemId: 'episode_1',
      sourceUrl: 'https://youtube.com/watch?v=abc',
      targetSeconds: 60,
      segments: [
        { startSec: 0, endSec: 20, text: 'one' },
        { startSec: 20, endSec: 62, text: 'two' },
        { startSec: 62, endSec: 90, text: 'three' },
      ],
    })

    expect(chunks).toHaveLength(2)
    expect(chunks[0]).toMatchObject({
      id: 'episode_1_chunk_0000',
      startSec: 0,
      endSec: 62,
      text: 'one two',
      urlAtTimestamp: 'https://youtube.com/watch?v=abc&t=0s',
    })
  })
})
