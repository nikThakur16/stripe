import './App.css'

export default function App() {
  return (
    <div className="app-landing">
      <header className="hero">
        <h1>Stripe Subscriptions Demo</h1>
        <p>Login or create an account, then pick a plan.</p>
        <div className="cta">
          <a className="btn" href="/login">Login</a>
          <a className="btn btn-primary" href="/register">Create account</a>
          <a className="btn btn-ghost" href="/billing">View plans</a>
        </div>
      </header>
    </div>
  )
}
