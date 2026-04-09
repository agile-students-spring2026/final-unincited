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
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
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
    <main className="login-container">
      <form className="login-box" onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          className="login-input"
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          className="login-input"
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
        />

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="signup-text">
          Need an account?{' '}
          <Link className="signup-link" to="/signup">
            Sign up
          </Link>
        </p>

        <p className="forgot-password">
          <Link className="forgot-password" to="/forgot-password">
            Forgot password?
          </Link>
        </p>
      </form>

      {error ? <p>{error}</p> : null}
    </main>
  )
}

export default LoginPage