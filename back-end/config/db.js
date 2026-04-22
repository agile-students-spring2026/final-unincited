import mongoose from 'mongoose'

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI in environment variables')
  }

  await mongoose.connect(mongoUri)
  console.log('MongoDB connected')
}

async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}

export {
  connectDB,
  disconnectDB
}
