import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import './ForgotPasswordPage.css'

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
    <main className="forgot-container">
      <form className="forgot-box" onSubmit={onSubmit}>
        <h1 className="forgot-title">Forgot Password</h1>
        <p className="forgot-subtext">Enter your email and we will send reset instructions.</p>

        <label htmlFor="email">Email</label>
        <input
          className="forgot-input"
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <button className="forgot-button" type="submit">Send Reset Request</button>

        <p className="back-to-login">
          <Link className="back-to-login" to="/">
            Back to login
          </Link>
        </p>
      </form>

      {message ? <p className="forgot-status forgot-success">{message}</p> : null}
      {error ? <p className="forgot-status forgot-error">{error}</p> : null}
    </main>
  )
}

export default ForgotPasswordPage
