import * as chai from 'chai'
import chaiHttp, { request } from 'chai-http'
import app from '../app.js'
import mockUsers from '../mockUsers.js'
import mockArticles from '../mockArticles.js'

const expect = chai.expect
chai.use(chaiHttp)


describe('GET /articles', () => {
  it('should return 200 and an array of articles', async () => {
    const res = await request.execute(app).get('/articles')

    expect(res).to.have.status(200)
    expect(res.body).to.have.property('articles')
    expect(res.body.articles).to.be.an('array').and.have.length.greaterThan(0)
  })
})




