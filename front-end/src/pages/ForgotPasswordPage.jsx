import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import './ForgotPasswordPage.css'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      // In this mode we will just return the full resetLink by extracting token adn email directly
      const url = new URL(data.resetLink)
      const token = url.searchParams.get('token')
      const emailFromLink = url.searchParams.get('email')

      navigate(`/reset-password?token=${token}&email=${encodeURIComponent(emailFromLink)}`)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="forgot-container"> 
      <form className="forgot-box" onSubmit={onSubmit}>
        <h1 className="forgot-title">Forgot Password</h1>
        <p className="forgot-subtext">Enter your email and we'll send you a reset link.</p>

        <label htmlFor="email">Email</label>
        <input
          className="forgot-input"
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="forgot-button" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {error && <p className="forgot-status forgot-error">{error}</p>}

        <p className="back-to-login">
          <Link to="/">Back to login</Link>
        </p>
      </form>
    </main>
  )
}

export default ForgotPasswordPage
