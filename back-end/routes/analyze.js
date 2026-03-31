import express from 'express'
const router = express.Router()


//analysis logic here
router.post('/analyze',(req,res)=>{
    res.json({message: 'analysis route'})
})

export default router;