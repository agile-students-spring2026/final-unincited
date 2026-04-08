import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

describe('Express app routes', () => {
  it('GET /health returns service status', async () => {
    const res = await request(app).get('/health')

    expect(res.status).to.equal(200)
    expect(res.body).to.deep.equal({ status: 'ok', service: 'news-bias-api' })
  })

  it('GET / returns static html file', async () => {
    const res = await request(app).get('/')

    expect(res.status).to.equal(200)
    expect(res.text).to.include('News Bias Comparison API')
  })

  it('GET /terms returns static html file', async () => {
    const res = await request(app).get('/terms')

    expect(res.status).to.equal(200)
    expect(res.text).to.include('Terms of Service')
  })

  it('GET /privacy returns static html file', async () => {
    const res = await request(app).get('/privacy')

    expect(res.status).to.equal(200)
    expect(res.text).to.include('Privacy Policy')
  })

  it('GET /articles returns mock article payload', async () => {
    const res = await request(app).get('/articles')

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('articles')
    expect(res.body.articles).to.be.an('array').and.have.length.greaterThan(0)
  })

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/not-a-real-route')

    expect(res.status).to.equal(404)
    expect(res.body.message).to.match(/route not found/i)
  })
})
