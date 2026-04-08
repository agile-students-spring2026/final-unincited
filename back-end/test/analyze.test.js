import { expect } from 'chai'
import request from 'supertest'
import sinon from 'sinon'
import axios from 'axios'
import app from '../app.js'

describe('POST /analyze', () => {
  let axiosStub
  let fetchStub
  
  beforeEach(() => {
    axiosStub = sinon.stub(axios, 'get')
    fetchStub = sinon.stub(global, 'fetch')
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

    fetchStub.resolves({
      json: async () => ({
        response: JSON.stringify({
          sentimentLabel: 'Positive',
          sentimentScore: 0.8,
          detectedTopic: 'Science',
          biasLabel: 'Center',
          biasScore: 0.2,
          confidenceScore: 0.9,
          explanation: 'Positive reporting on a science milestone.',
          evidenceLines: ['NASA released a striking new Artemis image.']
        })
      })
    })

    const res = await request(app)
      .post('/analyze')
      .send({
        url: 'https://example.com/article',
        userId: '123'
      })

    expect(res.status).to.equal(200)
    expect(res.body.message).to.equal('Article analyzed successfully.')
    expect(res.body.article.title).to.equal('Test Article')
    expect(res.body.article.author).to.equal('Jane Doe')
    expect(res.body.article.sentimentLabel).to.equal('Positive')
    expect(res.body.article.detectedTopic).to.equal('Science')
    expect(res.body.article.evidenceLines).to.be.an('array')
  })
})