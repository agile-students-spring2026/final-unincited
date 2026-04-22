import * as chai from 'chai'
import chaiHttp, { request } from 'chai-http'
import app from '../app.js'
import mockUsers from '../mockUsers.js'
import mockArticles from '../mockArticles.js'
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


const expect = chai.expect
chai.use(chaiHttp)


describe('GET /articles', () => {
  it('should return 200 and an array of articles', async () => {
    

    await request.execute(app)
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      })

    const loginRes = await request.execute(app)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password123',
      })

    const token = loginRes.body.token

    const res = await request.execute(app).get('/articles').set('Authorization', `JWT ${token}`)

    expect(res).to.have.status(200)
    expect(res.body).to.have.property('articles')
    expect(res.body.articles).to.be.an('array').and.have.length.greaterThan(0)
  })
})







