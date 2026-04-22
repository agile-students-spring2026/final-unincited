import { expect } from 'chai'
import request from 'supertest'
import sinon from 'sinon'
import axios from 'axios'
import app from '../app.js'
import mongoose from 'mongoose'
import { connectDB, disconnectDB } from '../config/db.js'
import User from '../models/User.js'

before(async function () {
  this.timeout(10000)
  await connectDB()
})

after(async function () {
  this.timeout(10000)
  await disconnectDB()
})

describe('POST /analyze',function () {
  this.timeout(10000)

  let axiosStub
  let agent
  let token
  

  beforeEach(async function() {
    sinon.restore()
    axiosStub = sinon.stub(axios, 'get')

    agent = request.agent(app)
    await User.deleteMany({})

    // create user first 
    await request(app)
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      })

    // login to get token
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password123',
      })

    token = loginRes.body.token
  })

  afterEach(() => {
    sinon.restore()
  })


  it('should return 401 if not authenticated', async () => {

    const res = await request(app)
      .post('/analyze')
      .send({ url: 'https://example.com/article' })

    expect(res.status).to.equal(401)
  })

  it('should return 400 if url is missing', async () => {
    const res = await agent
      .post('/analyze').set('Authorization', `JWT ${token}`)
      .send({ title: 'Missing URL test' })

    expect(res.status).to.equal(400)
    expect(res.body.error).to.equal('URL is required.')
  })

  it('should return 400 for invalid URL input', async () => {
    const res = await agent
      .post('/analyze').set('Authorization', `JWT ${token}`)
      .send({ url: 'not-a-real-url' })

    expect(res.status).to.equal(400)
    expect(res.body.error).to.equal(
      'Please provide a valid article URL starting with http:// or https://.'
    )
  })

  it('should return 422 if scraper is blocked', async () => {
    axiosStub.rejects({
      response: {
        status: 401,
      },
    })

    const res = await agent
      .post('/analyze').set('Authorization', `JWT ${token}`)
      .send({ url: 'https://cnn.com/some-article' })

    expect(res.status).to.equal(422)
    expect(res.body.error).to.equal('This article source blocked access.')
    expect(res.body.details).to.equal(
      'Try another article source like NPR or AP News.'
    )
  })

  it('should return 404 if article url is not found', async () => {
    axiosStub.rejects({
      response: { status: 404 },
    })

    const res = await agent
      .post('/analyze').set('Authorization', `JWT ${token}`)
      .send({ url: 'https://example.com/missing-article' })

    expect(res.status).to.equal(404)
    expect(res.body.error).to.equal('Article URL not found.')
    expect(res.body.details).to.equal('The provided URL returned 404.')
  })

  it('should extract a valid URL from noisy pasted input', async () => {
    const originalGroq = process.env.GROQ_API_KEY
    const originalOpenAI = process.env.OPENAI_API_KEY
    delete process.env.GROQ_API_KEY
    delete process.env.OPENAI_API_KEY

    axiosStub.resolves({
      data: `
        <html>
          <head>
            <title>Noisy URL Test</title>
            <meta property="og:title" content="Noisy URL Test" />
            <meta name="author" content="Jane Doe" />
            <meta property="article:published_time" content="2026-04-07T12:00:00Z" />
            <meta property="og:site_name" content="CNN.com" />
          </head>
          <body>
            <article>
              The conflict escalated and multiple statements were issued.
            </article>
          </body>
        </html>
      `,
    })

    const noisyInput =
      'Server running on port: 3000 ... stack trace ... https://www.cnn.com/2026/04/09/world/live-news/iran-war-trump-us-ceasefire'

    const res = await agent
      .post('/analyze').set('Authorization', `JWT ${token}`)
      .send({ url: noisyInput })

    if (originalGroq) process.env.GROQ_API_KEY = originalGroq
    if (originalOpenAI) process.env.OPENAI_API_KEY = originalOpenAI

    expect(axiosStub.firstCall.args[0]).to.equal(
      'https://www.cnn.com/2026/04/09/world/live-news/iran-war-trump-us-ceasefire'
    )

    expect([200, 500]).to.include(res.status)
  })

  it('should return 500 if axios throws an unexpected error', async () => {
    axiosStub.rejects(new Error('Network Error'))

    const res = await agent
      .post('/analyze').set('Authorization', `JWT ${token}`)
      .send({ url: 'https://example.com/article' })

    expect(res.status).to.equal(500)
    expect(res.body.error).to.equal('Failed to analyze article.')
    expect(res.body.details).to.equal('Network Error')
  })

  it('should attempt to analyze a valid article page', async () => {
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
            <meta property="og:site_name" content="AP News" />
          </head>
          <body>
            <article>
              NASA released a striking new Artemis image. Scientists praised the mission.
            </article>
          </body>
        </html>
      `,
    })

    const res = await agent
      .post('/analyze').set('Authorization', `JWT ${token}`)
      .send({ url: 'https://example.com/article' })

    if (originalGroq) process.env.GROQ_API_KEY = originalGroq
    if (originalOpenAI) process.env.OPENAI_API_KEY = originalOpenAI

    expect(axiosStub.calledOnce).to.equal(true)
    expect(axiosStub.firstCall.args[0]).to.equal('https://example.com/article')

    // Depending on analyzeWithLLM behavior in your app, this may succeed or fail.
    expect([200, 500]).to.include(res.status)

    if (res.status === 200) {
      expect(res.body.message).to.equal('Article analyzed successfully.')
      expect(res.body.article).to.be.an('object')
      expect(res.body.article.url).to.equal('https://example.com/article')
    }

    if (res.status === 500) {
      expect(res.body.error).to.equal('Failed to analyze article.')
    }
  })
})