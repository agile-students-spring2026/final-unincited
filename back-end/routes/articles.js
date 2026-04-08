import express from 'express'
import mockUsers from '../mockUsers.js'

const router = express.Router()

//get all articles
router.get('/', (req, res) => {
  res.json({ message: 'get all articles' })
})

// get saved and submitted articles for a user
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

// save article for a user
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

//get an article by id
router.get('/:id', (req, res) => {
  res.json({ message: `get article ${req.params.id}` })
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
  
    user.savedArticles = user.savedArticles.filter(
        (a) => String(a.id) !== String(articleId)
    )
  
    res.status(200).json({
      message: 'Article unsaved successfully',
      savedArticles: user.savedArticles,
    })
  })

export default router