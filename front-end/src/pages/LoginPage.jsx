import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      //login req
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      localStorage.setItem('token', data.token)

      navigate("/dashboard");
    } catch (err) {
      if (err.message === "Invalid credentials") {
        setError("Invalid email or password");
      } else if (err.message.includes("Failed to fetch")) {
        setError("Unable to connect. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={onSubmit}>
        
        <div className="login-title">Log In</div>
        

        <div className="login-field">
          <div className="login-label">Email</div>
          <input
            className="login-input"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="login-field">
          <div className="login-label">Password</div>
          <input
            className="login-input"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </div>

        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {error && <div className="login-error">{error}</div>}

        <div className="login-links">
          <div>
            <Link to="/signup">Sign up</Link>
          </div>
          <div>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          
        </div>

      </form>
    </div>
  )
}

export default LoginPage