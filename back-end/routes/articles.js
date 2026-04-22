import express from 'express'
import passport from 'passport'
import User from '../models/User.js'
import Article from '../models/Article.js'
const router = express.Router()


// we returns all articles in the database
router.get('/', passport.authenticate('jwt', { session: false }),async (req, res) => {
  try {
    const articles = await Article.find()
    return res.status(200).json({ articles })
  } catch (err) {
    return res.status(500).json({
      message: 'Error fetching articles',
      error: err.message,
    })
  }
})

router.get('/me', passport.authenticate('jwt', { session: false }), async(req, res) => {
  try{

    const user = await User.findById(req.user._id).populate('savedArticles')
          .populate('submittedArticles')
          .exec()

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }
    

    return res.status(200).json({
      savedArticles: user.savedArticles,
      submittedArticles: user.submittedArticles,
    })
}catch(error){
  return res.status(500).json({
      message: 'Error fetching user articles',
      error: err.message,
    })

}
})

router.post('/save', passport.authenticate('jwt', { session: false }),async(req, res) => {
  
  const { articleId } = req.body

  if (!articleId) {
    return res.status(400).json({
      message: 'article is required',
    })
  }

  const user = await User.findById(req.user._id).populate('savedArticles')
        .populate('submittedArticles')
        .exec()

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    })
  }

  const alreadySaved = user.savedArticles.some(
    (a) => String(a) === String(articleId)
  )

  if (alreadySaved) {
    return res.status(200).json({
      message: 'Article already saved',
      savedArticles: user.savedArticles,
    })
  }

  user.savedArticles.push(articleId)
  await user.save()
  await user.populate('savedArticles')

  res.status(200).json({
    message: 'Article saved successfully',
    savedArticles: user.savedArticles,
  })
})


// remove a saved article for a user
router.post('/unsave',passport.authenticate('jwt', { session: false }), async(req, res) => {

  const { articleId } = req.body


  if (!articleId) {
    return res.status(400).json({
      message: 'articleId are required',
    })
  }

  const user = await User.findById(req.user._id)

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    })
  }

  // Filter out the article with the matching id
  user.savedArticles = user.savedArticles.filter(
    (a) => String(a) !== String(articleId)
  )
  await user.save()
  await user.populate('savedArticles')

  res.status(200).json({
    message: 'Article unsaved successfully',
    savedArticles: user.savedArticles,
  })
})


//get an article by id
router.get('/:id', passport.authenticate('jwt', { session: false }),async(req, res) => {
  const article = await Article.findById(req.params.id)

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