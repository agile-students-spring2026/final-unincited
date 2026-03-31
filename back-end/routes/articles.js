
import express from 'express'
const router = express.Router()

//get all articles
router.get('/', (req,res)=>{
    res.json({ message: 'get all articles' })
})

//get an article by id
router.get('/:id', (req,res)=>{
    res.json({ message: `get article ${req.params.id}`})
})
export default router;