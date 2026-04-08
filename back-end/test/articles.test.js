import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'
import { saveArticle, getAllArticles } from '../services/articleStore.js'

describe('GET /articles/stats', () => {
  it('should return total articles plus average bias and sentiment from stored articles', async () => {
    saveArticle({
      url: 'https://example.com/a',
      title: 'Article A',
      biasScore: 0.6,
      sentimentScore: -0.2,
      createdAt: new Date('2026-04-08T10:00:00Z')
    })

    saveArticle({
      url: 'https://example.com/b',
      title: 'Article B',
      biasScore: -0.2,
      sentimentScore: 0.4,
      createdAt: new Date('2026-04-08T11:00:00Z')
    })

    const articles = getAllArticles()
    const expectedTotal = articles.length
    const expectedAverageBias = Number(
      (articles.reduce((sum, article) => sum + (article.biasScore || 0), 0) / expectedTotal).toFixed(2)
    )
    const expectedAverageSentiment = Number(
      (articles.reduce((sum, article) => sum + (article.sentimentScore || 0), 0) / expectedTotal).toFixed(2)
    )

    const res = await request(app).get('/articles/stats')

    expect(res.status).to.equal(200)
    expect(res.body).to.deep.equal({
      totalArticles: expectedTotal,
      averageBiasScore: expectedAverageBias,
      averageSentimentScore: expectedAverageSentiment
    })
  })
})
