import express from 'express'
import mockUsers from '../mockUsers.js'

const router = express.Router()

router.get('/login', (req, res) => {
  res.json({ message: 'login' })
})

router.post('/register', (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email, and password are required',
    })
  }

  const existingUser = mockUsers.find((user) => user.email === email)

  if (existingUser) {
    return res.status(409).json({
      message: 'User already exists',
    })
  }

  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    password,
    savedArticles: [],
    submittedArticles: [],
  }

  mockUsers.push(newUser)

  res.status(201).json({
    message: 'User created successfully',
    user: newUser,
  })
})

router.post('/reset', (req, res) => {
  res.json({ message: 'reset' })
})

export default router