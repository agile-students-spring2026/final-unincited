import { expect } from 'chai'
import { safeParseJSON, addHighlights } from '../services/analyzeArticle.js'
import { preprocessText } from '../services/scrapeArticle.js'


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
})