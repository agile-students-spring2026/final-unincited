import express from 'express'
import crypto from 'crypto'
import mockUsers from '../mockUsers.js'
import mockArticles from '../mockArticles.js'

const router = express.Router()

function getSessionUser(req, res) {
  const sessionUser = req.session?.user

  if (!sessionUser) {
    res.status(401).json({ message: 'Not authenticated' })
    return null
  }

  return sessionUser
}

// we returns all articles in the mock database (need to change later)
router.get('/', (req, res) => {
  return res.status(200).json({ articles: mockArticles })
})

router.get('/me', (req, res) => {
  const sessionUser = getSessionUser(req, res)
  if (!sessionUser) return

  const user = mockUsers.find((u) => u.id === Number(sessionUser.id))

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    })
  }
  const submittedArticles = (user.submittedArticles || [])
    .map((articleRef) => {
      const articleId = articleRef
      return mockArticles.find((article) => String(article.id) === String(articleId))
    })

  return res.status(200).json({
    savedArticles: user.savedArticles,
    submittedArticles,
  })
})

router.post('/save', (req, res) => {
  const sessionUser = getSessionUser(req, res)
  if (!sessionUser) return
  const { article } = req.body

  if (!article) {
    return res.status(400).json({
      message: 'article is required',
    })
  }

  const user = mockUsers.find((u) => u.id === Number(sessionUser.id))

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
  const sessionUser = getSessionUser(req, res)
  if (!sessionUser) return
  const { articleId } = req.body


  if (!articleId) {
    return res.status(400).json({
      message: 'articleId are required',
    })
  }

  const user = mockUsers.find((u) => u.id === sessionUser.id)

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