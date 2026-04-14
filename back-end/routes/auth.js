import express from 'express'
import mockUsers from '../mockUsers.js'

const router = express.Router()


//sign up route
router.post('/signup', (req, res) => {
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

// log in existing user
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
  

  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ message: 'Login failed' })
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    return res.status(200).json({
      message: 'Login successful',
      user: req.session.user,
    })
  })

})

// end user session
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' })
    }

    res.clearCookie('sid')
    return res.status(200).json({ message: 'Logged out successfully' })
  })
})


//for my articles page, gets current user with appropriate info
router.get('/current-user', (req,res)=>{
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  return res.status(200).json({
    user: req.session.user,
  })

})


//TODO : reset functionality
router.post('/forgot-password',(req, res) => {
  res.json({ message: 'forgot' })
})
router.post('/reset-password', (req, res) => {
  res.json({ message: 'reset' })
})

export default router