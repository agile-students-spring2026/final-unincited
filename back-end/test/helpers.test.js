import { expect } from 'chai'
import { safeParseJSON, addHighlights } from '../services/analyzeArticle.js'
import { preprocessText } from '../services/scrapeArticle.js'
import {getNormalizedHttpUrl } from '../routes/analyze.js'



describe('preprocessText', () => {
  it('should collapse extra whitespace', () => {
    const result = preprocessText('hello   world\n\n test')
    expect(result).to.equal('hello world test')
  })
})

describe('safeParseJSON', () => {
  it('should parse valid JSON', () => {
    const result = safeParseJSON('{"sentimentLabel":"Positive"}')
    expect(result.sentimentLabel).to.equal('Positive')
  })

  it('should parse JSON with smart quotes inside string values', () => {
    const payload = '{"quote":"US forces will remain “in place” until a full agreement is reached."}'
    const result = safeParseJSON(payload)

    expect(result).to.be.an('object')
    expect(result.quote).to.include('“in place”')
  })

  it('should parse JSON wrapped in markdown code fences', () => {
    const payload = '```json\n{"sentimentLabel":"Neutral"}\n```'
    const result = safeParseJSON(payload)

    expect(result).to.be.an('object')
    expect(result.sentimentLabel).to.equal('Neutral')
  })

  it('should return null for invalid JSON', () => {
    const result = safeParseJSON('not valid json')
    expect(result).to.equal(null)
  })
})

describe('addHighlights', () => {
  it('should add correct indices for found highlight', () => {
    const body = 'NASA released a striking new Artemis image.'
    const result = addHighlights(body, ['striking new Artemis'])

    expect(result[0].startIndex).to.equal(body.indexOf('striking new Artemis'))
    expect(result[0].endIndex).to.equal(
      body.indexOf('striking new Artemis') + 'striking new Artemis'.length
    )
  })

  it('should return null indices when highlight is not found', () => {
    const result = addHighlights('hello world', ['missing phrase'])

    expect(result[0].startIndex).to.equal(null)
    expect(result[0].endIndex).to.equal(null)
  })

  it('should preserve taxonomy metadata when highlight objects are provided', () => {
    const body = 'Many believe this policy will inevitably destroy the neighborhood.'
    const result = addHighlights(body, [
      {
        quote: 'will inevitably destroy the neighborhood',
        taxonomyTag: 'speculative-projection',
        reason: 'Treats a hypothetical outcome as guaranteed.'
      }
    ])

    expect(result[0].taxonomyTag).to.equal('speculative-projection')
    expect(result[0].taxonomyLabel).to.equal('Speculative Projection')
    expect(result[0].colorHex).to.equal('#A9DCD4')
    expect(result[0].startIndex).to.be.a('number')
    expect(result[0].endIndex).to.be.greaterThan(result[0].startIndex)
  })

  it('should map repeated quote values to later occurrences in sequence', () => {
    const body = 'policy policy policy policy'
    const result = addHighlights(body, ['policy', 'policy', 'policy'])

    expect(result[0].startIndex).to.equal(0)
    expect(result[1].startIndex).to.equal(7)
    expect(result[2].startIndex).to.equal(14)
  })
})

describe('getNormalizedHttpUrl', () => {
  it('returns null for null input', () => {
    expect(getNormalizedHttpUrl(null)).to.equal(null)
  })

  it('returns null for undefined input', () => {
    expect(getNormalizedHttpUrl(undefined)).to.equal(null)
  })

  it('returns null for non-string input', () => {
    expect(getNormalizedHttpUrl(123)).to.equal(null)
    expect(getNormalizedHttpUrl({})).to.equal(null)
    expect(getNormalizedHttpUrl([])).to.equal(null)
  })

  it('returns null for empty string', () => {
    expect(getNormalizedHttpUrl('')).to.equal(null)
    expect(getNormalizedHttpUrl('   ')).to.equal(null)
  })

  it('returns a normalized https URL', () => {
    expect(getNormalizedHttpUrl('https://example.com')).to.equal('https://example.com/')
  })

  it('returns a normalized http URL', () => {
    expect(getNormalizedHttpUrl('http://example.com/test')).to.equal('http://example.com/test')
  })

  it('trims surrounding whitespace', () => {
    expect(getNormalizedHttpUrl('   https://example.com/test   ')).to.equal(
      'https://example.com/test'
    )
  })
})