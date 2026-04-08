import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import { mockArticles } from './data/mockData.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.join(__dirname, '..', 'public')

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
    })
  )
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/static', express.static(publicDir))

  app.get('/', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })

  app.get('/terms', (_req, res) => {
    res.sendFile(path.join(publicDir, 'terms.html'))
  })

  app.get('/privacy', (_req, res) => {
    res.sendFile(path.join(publicDir, 'privacy.html'))
  })

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'news-bias-api' })
  })

  app.get('/api/articles', (_req, res) => {
    res.json({ articles: mockArticles })
  })

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    return res.json({
      message: 'Login successful.',
      token: 'mock-jwt-token',
      user: {
        id: 'user_1001',
        email,
        name: 'Demo User'
      }
    })
  })

  app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    return res.status(201).json({
      message: 'Account created.',
      user: {
        id: 'user_1002',
        name,
        email
      }
    })
  })

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
  })

  return app
}
