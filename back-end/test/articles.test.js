import * as chai from 'chai'
import chaiHttp, { request } from 'chai-http'
import app from '../app.js'
import mockUsers from '../mockUsers.js'
import mockArticles from '../mockArticles.js'

const expect = chai.expect
chai.use(chaiHttp)

describe('POST /articles/submit', () => {
  let initialArticleCount
  let initialSubmittedCount

  beforeEach(() => {
    initialArticleCount = mockArticles.length
    initialSubmittedCount = mockUsers[0].submittedArticles.length
  })

  it('should return 400 when userId is missing', async () => {
    const res = await request.execute(app).post('/articles/submit').send({
      url: 'https://example.com/article',
    })

    expect(res).to.have.status(400)
    expect(res.body.message).to.equal('userId and url are required')
  })

  it('should return 400 when url is missing', async () => {
    const res = await request.execute(app).post('/articles/submit').send({
      userId: 1,
    })

    expect(res).to.have.status(400)
    expect(res.body.message).to.equal('userId and url are required')
  })

  it('should return 404 when userId does not match any user', async () => {
    const res = await request.execute(app).post('/articles/submit').send({
      userId: 9999,
      url: 'https://example.com/article',
    })

    expect(res).to.have.status(404)
    expect(res.body.message).to.equal('User not found')
  })

  it('should return 201 and the new article on a valid submission', async () => {
    const res = await request.execute(app).post('/articles/submit').send({
      userId: 1,
      url: 'https://example.com/test-article',
      title: 'Test Article Title',
    })

    expect(res).to.have.status(201)
    expect(res.body.message).to.equal('Article submitted successfully.')
    expect(res.body.article).to.be.an('object')
  })

  it('should set status to "pending" on the new article', async () => {
    const res = await request.execute(app).post('/articles/submit').send({
      userId: 1,
      url: 'https://example.com/pending-test',
      title: 'Pending Test',
    })

    expect(res.body.article.status).to.equal('pending')
  })

  it('should use the url as title when no title is provided', async () => {
    const url = 'https://example.com/no-title'
    const res = await request.execute(app).post('/articles/submit').send({
      userId: 1,
      url,
    })

    expect(res).to.have.status(201)
    expect(res.body.article.title).to.equal(url)
  })

  it('should add the article to the global mockArticles list', async () => {
    await request.execute(app).post('/articles/submit').send({
      userId: 1,
      url: 'https://example.com/global-list-test',
      title: 'Global List Test',
    })

    expect(mockArticles.length).to.equal(initialArticleCount + 1)
  })

  it("should add the article to the user's submittedArticles list", async () => {
    await request.execute(app).post('/articles/submit').send({
      userId: 1,
      url: 'https://example.com/user-list-test',
      title: 'User List Test',
    })

    expect(mockUsers[0].submittedArticles.length).to.equal(
      initialSubmittedCount + 1
    )
  })

  it('should assign a unique id to each submitted article', async () => {
    const res1 = await request.execute(app).post('/articles/submit').send({
      userId: 1,
      url: 'https://example.com/article-a',
    })

    const res2 = await request.execute(app).post('/articles/submit').send({
      userId: 1,
      url: 'https://example.com/article-b',
    })

    expect(res1.body.article.id).to.not.equal(res2.body.article.id)
  })
})

describe('GET /articles', () => {
  it('should return 200 and an array of articles', async () => {
    const res = await request.execute(app).get('/articles')

    expect(res).to.have.status(200)
    expect(res.body).to.have.property('articles')
    expect(res.body.articles).to.be.an('array').and.have.length.greaterThan(0)
  })
})

describe('GET /articles/user/:userId', () => {
  it('should return saved and submitted articles for a valid user', async () => {
    const res = await request.execute(app).get('/articles/user/1')

    expect(res).to.have.status(200)
    expect(res.body).to.have.property('savedArticles')
    expect(res.body).to.have.property('submittedArticles')
    expect(res.body.savedArticles).to.be.an('array')
    expect(res.body.submittedArticles).to.be.an('array')
  })

  it('should return 404 for an unknown userId', async () => {
    const res = await request.execute(app).get('/articles/user/9999')

    expect(res).to.have.status(404)
    expect(res.body.message).to.equal('User not found')
  })
})

describe('GET /articles/:id', () => {
  it('should return 404 for a non-existent article id', async () => {
    const res = await request.execute(app).get('/articles/does-not-exist')

    expect(res).to.have.status(404)
    expect(res.body).to.have.property('error')
  })

  it('should return the article for a valid id', async () => {
    const knownId = mockArticles[0].id
    const res = await request.execute(app).get(`/articles/${knownId}`)

    expect(res).to.have.status(200)
    expect(res.body.article.id).to.equal(knownId)
  })
})
