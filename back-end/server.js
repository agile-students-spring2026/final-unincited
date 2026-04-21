import 'dotenv/config'
import app from './app.js'
import { connectDB, disconnectDB } from './config/db.js'

const port = process.env.PORT || 3000
let listener

const start = async () => {
  try {
    await connectDB()

    listener = app.listen(port, function () {
      console.log(`Server running on port: ${port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

const close = async () => {
  if (listener) {
    await new Promise((resolve, reject) => {
      listener.close((error) => {
        if (error) return reject(error)
        resolve()
      })
    })
  }

  await disconnectDB()
}

start()

export { close }
