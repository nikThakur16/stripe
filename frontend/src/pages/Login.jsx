import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token)
        navigate('/billing')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (e) {
      setError('Login error')
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form glass" onSubmit={onSubmit}>
        <h2>Welcome back</h2>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        {error && <div className="error small">{error}</div>}
        <button className="btn btn-primary" type="submit">Login</button>
        <div className="muted">
          No account? <Link to="/register">Create one</Link>
        </div>
      </form>
    </div>
  )
} 