import { describe, expect, it } from 'vitest'
import { parseHubspotIdeas } from '../scripts/import-hubspot-mfm'
import { parseMfmEpisodes } from '../scripts/import-mfm-latest'

describe('import parsers', () => {
  it('extracts HubSpot candidate ideas from html', () => {
    const ideas = parseHubspotIdeas('<main>business idea Garage Shelving Installation</main>')
    expect(ideas[0]?.title).toBe('Garage Shelving Installation')
  })

  it('extracts MFM episodes from html links', () => {
    const episodes = parseMfmEpisodes('<a href="/episodes/ai-business">AI business ideas that made millions</a>')
    expect(episodes[0]).toMatchObject({
      title: 'AI business ideas that made millions',
      url: 'https://www.mfmpod.com/episodes/ai-business',
      transcriptStatus: 'unavailable',
    })
  })
})
