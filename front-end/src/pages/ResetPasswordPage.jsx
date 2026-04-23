import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import './ResetPasswordPage.css'

function ResetPasswordPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const emailFromLink = searchParams.get('email')
  
    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const onChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        
        if (form.newPassword !== form.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (form.newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            await apiRequest('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, email: emailFromLink, newPassword: form.newPassword }),
            })

            navigate('/?reset=success')
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Guard for if no token
    if (!token || !emailFromLink) {
    return (
      <main className="reset-container">
        <div className="reset-box">
          <h1 className="reset-title">Invalid Link</h1>
          <p className="reset-subtext">This reset link is missing or invalid.</p>
          <Link className="back-to-login" to="/">Back to login</Link>
        </div>
      </main>
    )
  }
  return (
    <main className="reset-container">
        <form className="reset-box" onSubmit={onSubmit}>
            <h1 className="reset-title">Reset Password</h1>
            <p className="reset-subtext">Choose a new password for <strong>{emailFromLink}</strong></p>

            <label htmlFor="newPassword">New Password</label>
            <input
                className="reset-input"
                id="newPassword"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={onChange}
                required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
                className="reset-input"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={onChange}
                required
            />

            <button className="reset-button" type="submit" disabled={loading}>  
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            {error && <p className="reset-status reset-error">{error}</p>}

            <p className="back-to-login">
                <Link to="/">Back to login</Link>
            </p>
        </form>
    </main>
  )
}

export default ResetPasswordPage