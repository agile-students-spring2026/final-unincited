import * as chai from 'chai'
import chaiHttp, { request } from 'chai-http'
import app from '../app.js'
import mongoose from 'mongoose'
import { connectDB, disconnectDB } from '../config/db.js'

before(async function () {
  this.timeout(10000)
  await connectDB()
})

after(async function () {
  this.timeout(10000)
  await disconnectDB()
})

const expect = chai.expect
chai.use(chaiHttp)

describe('Auth Routes', () => {
  it('should create a user', async () => {
    const res = await request.execute(app).post('/auth/signup').send({
      name: 'Uma',
      email: 'uma_test@example.com',
      password: '123'
    })

    expect(res).to.have.status(200)
    expect(res.body).to.have.property('email')
  })
  it('should login an existing user', async () => {
    const res = await request.execute(app).post('/auth/login').send({
      email: 'uma_test@example.com',
      password: '123'
    })

    expect(res).to.have.status(200)
    expect(res.body.email).to.equal('uma_test@example.com')
  })

  it('should reject login with invalid credentials', async () => {
    const res = await request.execute(app).post('/auth/login').send({
      email: 'uma-test@example.com',
      password: 'wrong-password'
    })

    expect(res).to.have.status(401)
    expect(res.body).to.have.property('message')
  })

  

  it('should return 400 when required fields are missing', async () => {
    const res = await request.execute(app).post('/auth/signup').send({
      name: 'Uma'
    })

    expect(res).to.have.status(400)
    expect(res.body).to.have.property('message')
  })

})