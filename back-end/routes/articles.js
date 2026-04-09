import express from 'express'
import crypto from 'crypto'
import mockUsers from '../mockUsers.js'
import mockArticles from '../mockArticles.js'

const router = express.Router()

// we returns all articles in the mock database (need to change later)
router.get('/', (req, res) => {
  return res.status(200).json({ articles: mockArticles })
})

// returns the saved and submitted article lists user 
router.get('/user/:userId', (req, res) => {
  const userId = Number(req.params.userId)
  const user = mockUsers.find((u) => u.id === userId)

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    })
  }

  res.status(200).json({
    savedArticles: user.savedArticles,
    submittedArticles: user.submittedArticles,
  })
})

// Submit articles post request, creates a new pending article, and is added to user array plus the global mockArticles list 
router.post('/submit', (req, res) => {
  const { userId, url, title } = req.body

  // userId and url are required to create a submission (userId should be validated)
  if (!userId || !url) {
    return res.status(400).json({
      message: 'userId and url are required',
    })
  }

  // look up the user who is submitting the article
  const user = mockUsers.find((u) => u.id === Number(userId))

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    })
  }

  // build the new article object in pending state.
  // fields are not filled yet as /analyze route processes the article.
  const newArticle = {
    id: crypto.randomUUID(),
    url,
    title: title || url,
    source: null,
    author: null,
    publicationDate: null,
    thumbnail: null,
    articleText: null,
    status: 'pending',
    detectedTopic: null,
    sentimentLabel: null,
    sentimentScore: null,
    biasLabel: null,
    biasScore: null,
    confidenceScore: null,
    explanation: null,
    evidenceLines: [],
    submittedBy: Number(userId),
    createdAt: new Date(),
  }

  // add to the global articles list
  mockArticles.push(newArticle)

  // add to the users personal submitted articles list
  user.submittedArticles.push(newArticle)

  return res.status(201).json({
    message: 'Article submitted successfully.',
    article: newArticle,
  })
})


router.post('/save', (req, res) => {
  const { userId, article } = req.body

  if (!userId || !article) {
    return res.status(400).json({
      message: 'userId and article are required',
    })
  }

  const user = mockUsers.find((u) => u.id === Number(userId))

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    })
  }

  const alreadySaved = user.savedArticles.some(
    (a) => String(a.id) === String(article.id)
  )

  if (alreadySaved) {
    return res.status(200).json({
      message: 'Article already saved',
      savedArticles: user.savedArticles,
    })
  }

  user.savedArticles.push(article)

  res.status(200).json({
    message: 'Article saved successfully',
    savedArticles: user.savedArticles,
  })
})


// remove a saved article for a user
router.post('/unsave', (req, res) => {
  const { userId, articleId } = req.body

  if (!userId || !articleId) {
    return res.status(400).json({
      message: 'userId and articleId are required',
    })
  }

  const user = mockUsers.find((u) => u.id === Number(userId))

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    })
  }

  // Filter out the article with the matching id
  user.savedArticles = user.savedArticles.filter(
    (a) => String(a.id) !== String(articleId)
  )

  res.status(200).json({
    message: 'Article unsaved successfully',
    savedArticles: user.savedArticles,
  })
})


//get an article by id
router.get('/:id', (req, res) => {
  const article = mockArticles.find((article) => article.id === req.params.id)

  if (!article) {
    return res.status(404).json({
      error: 'Article not found',
    })
  }

  res.status(200).json({
    message: 'Found article',
    article,
  })
})

export default router