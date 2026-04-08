import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../lib/api'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      const data = await apiRequest('/auth/reset', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setMessage(data.message || 'Reset request submitted.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main>
      <h1>Forgot Password</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button type="submit">Send Reset Request</button>
      </form>
      {message ? <p>{message}</p> : null}
      {error ? <p>{error}</p> : null}
      <p>
        <Link to="/">Back to login</Link>
      </p>
    </main>
  )
}

export default ForgotPasswordPage
