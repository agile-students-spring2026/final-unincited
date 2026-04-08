import express from 'express'
import mockUsers from '../mockUsers.js'

const router = express.Router()

router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
    })
  }

  const user = mockUsers.find(
    (existingUser) => existingUser.email === email && existingUser.password === password
  )

  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials',
    })
  }

  return res.status(200).json({
    message: 'Login successful',
    token: 'mock-jwt-token',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
})

const registerHandler = (req, res) => {
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
}

router.post('/register', registerHandler)
router.post('/signup', registerHandler)

router.post('/reset', (req, res) => {
  res.json({ message: 'reset' })
})

export default router