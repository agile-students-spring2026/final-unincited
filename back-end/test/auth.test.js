import * as chai from 'chai'
import chaiHttp, { request } from 'chai-http'
import app from '../app.js'

const expect = chai.expect
chai.use(chaiHttp)

describe('Auth Routes', () => {
  it('should create a user', async () => {
    const res = await request.execute(app).post('/auth/register').send({
      name: 'Uma',
      email: 'uma_test@example.com',
      password: '123'
    })

    expect(res).to.have.status(201)
    expect(res.body).to.have.property('user')
  })

  it('should return 400 when required fields are missing', async () => {
    const res = await request.execute(app).post('/auth/register').send({
      name: 'Uma'
    })

    expect(res).to.have.status(400)
    expect(res.body).to.have.property('message')
  })
})