import { expect } from 'chai'
import request from 'supertest'
import sinon from 'sinon'
import axios from 'axios'
import app from '../app.js'

describe('POST /analyze', () => {
  let axiosStub
  
  beforeEach(() => {
    axiosStub = sinon.stub(axios, 'get')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should return 400 if url is missing', async () => {
    const res = await request(app)
      .post('/analyze')
      .send({ userId: '123' })

    expect(res.status).to.equal(400)
    expect(res.body.error).to.equal('URL is required.')
  })

  it('should return 403 if scraper is blocked', async () => {
    axiosStub.rejects({
      response: { status: 403 }
    })

    const res = await request(app)
      .post('/analyze')
      .send({ url: 'https://cnn.com/some-article' })

    expect(res.status).to.equal(403)
    expect(res.body.error).to.equal('This site blocked the scraper request.')
  })

  it('should return 400 for invalid URL input', async () => {
    const res = await request(app)
      .post('/analyze')
      .send({ url: 'not-a-real-url' })

    expect(res.status).to.equal(400)
    expect(res.body.error).to.equal('Please provide a valid article URL starting with http:// or https://.')
  })

  it('should return 404 if article url is not found', async () => {
    axiosStub.rejects({
      response: { status: 404 }
    })

    const res = await request(app)
      .post('/analyze')
      .send({ url: 'https://example.com/missing-article' })

    expect(res.status).to.equal(404)
    expect(res.body.error).to.equal('Article URL not found.')
  })

  it('should return 200 and analyzed article on success', async () => {
    const originalGroq = process.env.GROQ_API_KEY
    const originalOpenAI = process.env.OPENAI_API_KEY
    delete process.env.GROQ_API_KEY
    delete process.env.OPENAI_API_KEY

    axiosStub.resolves({
      data: `
        <html>
          <head>
            <title>Test Article</title>
            <meta property="og:title" content="Test Article" />
            <meta name="author" content="Jane Doe" />
            <meta property="article:published_time" content="2026-04-07T12:00:00Z" />
          </head>
          <body>
            <article>
              NASA released a striking new Artemis image. Scientists praised the mission.
            </article>
          </body>
        </html>
      `
    })

    const res = await request(app)
      .post('/analyze')
      .send({
        url: 'https://example.com/article',
        userId: '123'
      })

    if (originalGroq) {
      process.env.GROQ_API_KEY = originalGroq
    }
    if (originalOpenAI) {
      process.env.OPENAI_API_KEY = originalOpenAI
    }

    expect(res.status).to.equal(200)
    expect(res.body.message).to.equal('Article analyzed successfully.')
    expect(res.body.article.title).to.equal('Test Article')
    expect(res.body.article.author).to.equal('Jane Doe')
    expect(res.body.article.sentimentLabel).to.equal('Unknown')
    expect(res.body.article.detectedTopic).to.equal('Unknown')
    expect(res.body.article.evidenceLines).to.be.an('array')
  })

  it('should extract a valid URL from noisy pasted input', async () => {
    const originalGroq = process.env.GROQ_API_KEY
    const originalOpenAI = process.env.OPENAI_API_KEY
    delete process.env.GROQ_API_KEY
    delete process.env.OPENAI_API_KEY

    axiosStub.resolves({
      data: `
        <html>
          <head><title>Noisy URL Test</title></head>
          <body>
            <article>
              The conflict escalated and multiple statements were issued.
            </article>
          </body>
        </html>
      `
    })

    const noisyInput = 'Server running on port: 3000 ... stack trace ... https://www.cnn.com/2026/04/09/world/live-news/iran-war-trump-us-ceasefire'

    const res = await request(app)
      .post('/analyze')
      .send({ url: noisyInput, userId: '123' })

    if (originalGroq) {
      process.env.GROQ_API_KEY = originalGroq
    }
    if (originalOpenAI) {
      process.env.OPENAI_API_KEY = originalOpenAI
    }

    expect(res.status).to.equal(200)
    expect(axiosStub.firstCall.args[0]).to.equal('https://www.cnn.com/2026/04/09/world/live-news/iran-war-trump-us-ceasefire')
    expect(res.body.article.url).to.equal('https://www.cnn.com/2026/04/09/world/live-news/iran-war-trump-us-ceasefire')
  })
})