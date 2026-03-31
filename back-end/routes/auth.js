import express from 'express'

const router = express.Router()


//possibly use passport for authentication
router.get('/login',(req,res)=>{
    res.json({message: 'login'})
})  
router.post('/register',(req,res)=>{
    res.json({message: 'register'})
})
router.post('/reset',(req,res)=>{
    res.json({message: 'reset'})
})

export default router;