import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

export function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token)
        navigate('/billing')
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (e) {
      setError('Registration error')
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form glass" onSubmit={onSubmit}>
        <h2>Create your account</h2>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        {error && <div className="error small">{error}</div>}
        <button className="btn btn-primary" type="submit">Create account</button>
        <div className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  )
} 