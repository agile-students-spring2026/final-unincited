// a mongoose model of a user
import mongoose from'mongoose'
const Schema = mongoose.Schema
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import jwtStrategy from'../config/jwt-config.js' // import setup options for using JWT in passport

// this is our mongoose model for a user
const UserSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique:true,
    required:true
  },
  password: {
    type: String,
    required: true,
  },
  savedArticles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
    },
  ],
  submittedArticles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
    },
  ],
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  }
})

// hash the password before the user is saved
// mongoose provides hooks that allow us to run code before or after specific events
UserSchema.pre('save', function (next) {
  const user = this
  // if the password has not changed, no need to hash it
  if (!user.isModified('password')) return next()
  // otherwise, the password is being modified, so hash it
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err)
    user.password = hash // update the password to the hashed version
    next()
  })
})

// mongoose allows us to attach methods to a model...

// compare a given password with the database hash
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

// return a JWT token for the user
UserSchema.methods.generateJWT = function () {
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + process.env.JWT_EXP_DAYS) // assuming an environment variable with num days in it

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },
    process.env.JWT_SECRET
  )
}

// return the user information without sensitive data
UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    token: this.generateJWT(),
  }
}

// create a model from this schema
const User = mongoose.model('User', UserSchema)

// export the model
export default User