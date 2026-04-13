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

})
