import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import './SignUpPage.css'

function SignUpPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      setSuccess('Account created. You can now log in.')
      setTimeout(() => navigate('/'), 700)
    } catch (err) {
      if (err.message === 'User already exists') {
        setError('An account with this email already exists')
      } else if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect. Please try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="signup-container">
    <form className="signup-box" onSubmit={onSubmit}>
      
      <div className="signup-title">Sign Up</div>

      <div className="signup-field">
        <div className="signup-label">Username</div>
        <input
          className="signup-input"
          name="name"
          type="text"
          value={form.name}
          onChange={onChange}
          required
        />
      </div>

      <div className="signup-field">
        <div className="signup-label">Email</div>
        <input
          className="signup-input"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
        />
      </div>

      <div className="signup-field">
        <div className="signup-label">Password</div>
        <input
          className="signup-input"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          minLength={6} //frontend validation
          required
        />
      </div>

      <button
        className="signup-button"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      {error && <div className="signup-error">{error}</div>}
      {success && <div className="signup-success">{success}</div>}

      <div className="back-to-login">
  
          <Link to="/" underline="none">Log in</Link>
    
      </div>

    </form>
  </div>
)
}

export default SignUpPage
