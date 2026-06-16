import { describe, expect, it } from 'vitest'
import { secondsToTimestamp, slugify, timestampUrl } from '../src/lib/format'

describe('format helpers', () => {
  it('formats timestamps', () => {
    expect(secondsToTimestamp(75)).toBe('1:15')
    expect(secondsToTimestamp(3675)).toBe('1:01:15')
  })

  it('creates timestamp urls', () => {
    expect(timestampUrl('https://youtube.com/watch?v=abc', 42)).toBe('https://youtube.com/watch?v=abc&t=42s')
    expect(timestampUrl('https://example.com/video', 42)).toBe('https://example.com/video?t=42s')
  })

  it('slugifies strings', () => {
    expect(slugify('My AI Tax Guy!')).toBe('my-ai-tax-guy')
  })
})
