import express from 'express'
import crypto from 'crypto'

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
        message: 'User already exists.',
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
      res.status(200).json({
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


// User submits email
router.post('/forgot-password', async (req, res) => {
  const {email} = req.body

  if (!email) {
    return res.status(400).json({success: false, message: 'Email is required'})
  }

  try {
    const user = await User.findOne({email})

    if (!user) {
      // Still return 200, we don't reveal email exists
      return res.status(200).json({success:true, message: 'If that email is registered, a reset link has been sent.'})
    }

    // Generate a random token and hash before storing
    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = Date.now() + 3600000 // one hour
    await user.save()

    // In production we email user the link with the raw token but forn ow we just reutrn it directly
    const resetLink = `http://localhost:5173/reset-password?token=${rawToken}&email=${email}`
    console.log(`[DEV ONLY] Reset link: ${resetLink}`)

    return res.status(200).json({
      success: true,
      message: 'Password reset link generated.',
      resetLink, // in production we would not return this, but instead email it to the user
    })
  } catch (err) {
    console.error('Forgot password error:', err)
    return res.status(500).json({success: false, message: 'Server error.', error: err})
  }
})

// User submits the token from link and a new password
router.post('/reset-password', async (req, res) => {
  const {token, email, newPassword} = req.body

  if (!token || !email || !newPassword) {
    return res.status(400).json({success: false, message: 'Token, email and new password are required.'})
  }

  try {
    // Hash incoming raw token vs what's stored
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {$gt: Date.now()}, // Make sure token is not expired
    })

    if (!user) {
      return res.status(400).json({success: false, message: 'Invalid or expired reset token.'})
    }

    // Set new password now that we verified
    user.password = newPassword
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()

    return res.status(200).json({success: true, message: 'Password has been reset successfully.'})
  } catch (err) {
    console.error('Reset password error:', err)
    return res.status(500).json({success: false, message: 'Server error.', error: err})
  }
})
export default router