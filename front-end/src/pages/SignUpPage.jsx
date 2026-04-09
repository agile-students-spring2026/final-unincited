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
    <main className="signup-container">
      <form className="signup-box" onSubmit={onSubmit}>
        <h1 className="signup-title">Sign Up</h1>

        <label htmlFor="name">Name</label>
        <input
          className="signup-input"
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={onChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          className="signup-input"
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          className="signup-input"
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          minLength={6}
          required
        />

        <button className="signup-button" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="back-to-login">
          Already have an account?{' '}
          <Link className="back-to-login" to="/">
            Log in
          </Link>
        </p>
      </form>

      {error ? <p>{error}</p> : null}
      {success ? <p>{success}</p> : null}
    </main>
  )
}

export default SignUpPage
