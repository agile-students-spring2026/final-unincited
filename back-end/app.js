import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import articlesRouter from './routes/articles.js'
import analyzeRouter from './routes/analyze.js'

const app = express()


app.use(cors())
app.use(express.json())

//authentication
app.use('/auth', authRouter)

//articles
app.use('/articles', articlesRouter)

//analyze
app.use('/analyze', analyzeRouter)



export default app
