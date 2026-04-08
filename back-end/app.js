import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import authRouter from './routes/auth.js'
import articlesRouter from './routes/articles.js'
import analyzeRouter from './routes/analyze.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.join(__dirname, 'public')


app.use(cors())
app.use(express.json())
app.use('/static', express.static(publicDir))

app.get('/', (req, res) => {
	res.sendFile(path.join(publicDir, 'index.html'))
})

app.get('/terms', (req, res) => {
	res.sendFile(path.join(publicDir, 'terms.html'))
})

app.get('/privacy', (req, res) => {
	res.sendFile(path.join(publicDir, 'privacy.html'))
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


app.use((req, res) => {
	res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
})


export default app
