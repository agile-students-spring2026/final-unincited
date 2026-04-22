import 'dotenv/config'
import express from 'express'

import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import authRouter from './routes/auth.js'
import articlesRouter from './routes/articles.js'
import analyzeRouter from './routes/analyze.js'
import jwt from'jsonwebtoken'
import passport from 'passport'
// use this JWT strategy within passport for authentication handling
import jwtStrategy from './config/jwt-config.js' // import setup options for using JWT in passport




const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.join(__dirname, 'public')



//passport
passport.use(jwtStrategy)

// tell express to use passport middleware
app.use(passport.initialize())


//middleware
app.use(cors({
	origin: process.env.CLIENT_URL || 'http://localhost:5173', //use CLIENT_URL when deployed
	credentials: true
}))
app.use(express.json())
app.use('/static', express.static(publicDir))


app.get('/', (req, res) => {
	res.sendFile(path.join(publicDir, 'index.html'))
})

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok', service: 'news-bias-api' })
})

//authentication
app.use('/auth', authRouter)

//articles
app.use('/articles', articlesRouter)

//analyze
app.use('/analyze', analyzeRouter)



export default app
