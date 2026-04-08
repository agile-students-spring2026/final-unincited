
import express from 'express'
import { getAllArticles, getArticleById, getArticleStats } from '../services/articleStore.js'

const router = express.Router()

router.get('/stats', (req, res) => {
    return res.status(200).json(getArticleStats())
})

//get all articles
router.get('/', (req, res) => {
    return res.status(200).json({ articles: getAllArticles() })
})

//get an article by id
router.get('/:id', (req, res) => {
    const article = getArticleById(req.params.id)

    if (!article) {
        return res.status(404).json({ error: 'Article not found.' })
    }

    return res.status(200).json({ article })
})

export default router;