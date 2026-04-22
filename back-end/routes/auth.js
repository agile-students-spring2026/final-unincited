import express from 'express'

//from /models
import User from '../models/User.js'

const router = express.Router()


//sign up route
router.post('/signup', async(req, res) => {

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email, and password are required',
    })
  }


  const existingUser = await User.findOne({email})

  if (existingUser) {
    return res.status(409).json({
      message: 'User already exists',
    })
  }

  //try to create a new user
  try{
    const user = await new User({ name,email, password,  savedArticles: [], submittedArticles: []}).save()

    const token = user.generateJWT()
    res.status(200).json({
        success: true,
        message: 'User saved successfully.',
        token: token,
        email: user.email,
      }) // send the token to the client to store
  }catch (err) {
      // error saving user to database... send an error response
      console.error(`Failed to save user: ${err}`)
      res.status(500).json({
        success: false,
        message: 'Error saving user to database.',
        error: err,
      })
      return
  }

})

// log in existing user
router.post('/login', async(req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
    })
  }

  //try to find user from database
  try {
      const user = await User.findOne({ email }).exec()
      // check if user was found
      if (!user) {
        console.error(`User not found.`)
        res.status(401).json({
          success: false,
          message: 'User not found in database.',
        })
        return
      }
      // if user exists, check if password is correct, use validPassword method from user model
      else if (!(await user.validPassword(password))) {
        console.error(`Incorrect password.`)
        res.status(401).json({
          success: false,
          message: 'Incorrect password.',
        })
        return
      }
      // user found and password is correct... send a success response
      console.log('User logged in successfully.')
      const token = user.generateJWT() // generate a signed token
      res.json({
        success: true,
        message: 'User logged in successfully.',
        token: token,
        email: user.email,
      }) // send the token to the client to store
      return
    } catch (err) {
      // check error
      console.error(`Error looking up user: ${err}`)
      res.status(500).json({
        success: false,
        message: 'Error looking up user in database.',
        error: err,
      })
      return
    }
  

})

// handles logging out requests from auth/logout
router.post('/logout', (req, res) => {
  // nothing really to do here... logging out with JWT authentication is handled entirely by the front-end by deleting the token from the browser's memory
    res.json({
      success: true,
      message:
        "There is actually nothing to do on the server side... you simply need to delete your token from the browser's local storage!",
    })
    return

})


//TODO : reset functionality
router.post('/forgot-password',(req, res) => {
  res.json({ message: 'forgot' })
})
router.post('/reset-password', (req, res) => {
  res.json({ message: 'reset' })
})

export default router