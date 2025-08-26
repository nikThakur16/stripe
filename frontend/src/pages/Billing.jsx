import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

export function Billing() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/plans`)
        const data = await res.json()
        setPlans(data.plans || [])
      } catch (e) {
        setError('Failed to load plans')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function subscribe(priceId) {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Unable to start checkout')
      }
    } catch (e) {
      setError('Checkout failed')
    }
  }

  if (loading) return <div className="center">Loading plans...</div>
  if (error) return <div className="center error">{error}</div>

  return (
    <div className="billing-page">
      <h2 className="title">Choose your plan</h2>
      <div className="plans-grid">
        {plans.map((p) => (
          <div key={p.id} className="plan-card glass neon">
            <div className="plan-header">
              <h3>{p.name}</h3>
              <p className="tagline">{p.tagline}</p>
              <div className="price">{p.priceDisplay}</div>
            </div>
            <ul className="features">
              {p.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <button className="btn btn-primary full" onClick={() => subscribe(p.stripePriceId)} disabled={!p.stripePriceId}>
              {p.stripePriceId ? 'Subscribe' : 'Configure price in .env'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 