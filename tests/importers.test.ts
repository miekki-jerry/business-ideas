import { describe, expect, it } from 'vitest'
import { parseHubspotIdeas } from '../scripts/import-hubspot-mfm'
import { parseMfmEpisodes, parseMfmRssEpisodes } from '../scripts/import-mfm-latest'

describe('import parsers', () => {
  it('extracts HubSpot candidate ideas from html', () => {
    const ideas = parseHubspotIdeas(
      '"cards": [{"title":"Garage Shelving","description":"Install shelves","filters":{"filter1":["Service"],"filter2":["Home"]},"cta":[{"link":{"url":{"href_with_scheme":"https://youtube.com/watch?v=abc&t=10s"}}}]}], "total_items": 1',
    )
    expect(ideas[0]?.title).toBe('Garage Shelving')
    expect(ideas[0]).toMatchObject({
      description: 'Install shelves',
      category: 'Service',
      useCase: 'Home',
      episodeUrl: 'https://youtube.com/watch?v=abc&t=10s',
    })
  })

  it('extracts MFM episodes from html links', () => {
    const episodes = parseMfmEpisodes('<a href="/episodes/ai-business">AI business ideas that made millions</a>')
    expect(episodes[0]).toMatchObject({
      title: 'AI business ideas that made millions',
      url: 'https://www.mfmpod.com/episodes/ai-business',
      transcriptStatus: 'unavailable',
    })
  })

  it('prefers MFM JSON-LD item list', () => {
    const episodes = parseMfmEpisodes(
      '<script type="application/ld+json">{"@graph":[{"@type":"ItemList","itemListElement":[{"url":"https://www.mfmpod.com/a/","name":"I put 80% of my money in the S&amp;P"}]}]}</script>',
    )
    expect(episodes[0]).toMatchObject({
      title: 'I put 80% of my money in the S&P',
      url: 'https://www.mfmpod.com/a/',
    })
  })

  it('extracts MFM episodes from RSS items', () => {
    const episodes = parseMfmRssEpisodes(
      '<item><title>Dumb iPhone Apps Are Making People Rich Again (Here’s how)</title><pubDate>Tue, 24 Feb 2026 14:35:00 -0000</pubDate></item>',
    )

    expect(episodes[0]).toMatchObject({
      title: 'Dumb iPhone Apps Are Making People Rich Again (Here’s how)',
      url: 'https://www.mfmpod.com/dumb-iphone-apps-are-making-people-rich-again-heres-how/',
      publishedAt: '2026-02-24T14:35:00.000Z',
      transcriptStatus: 'unavailable',
    })
  })
})
