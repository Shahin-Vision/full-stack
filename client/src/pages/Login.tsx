import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { login } from '../store/slices/authSlice'

export default function Login() {
  const dispatch = useDispatch<AppDispatch>()
  const nav = useNavigate()
  const { loading, error } = useSelector((s: RootState) => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await dispatch(login(form))
    if (login.fulfilled.match(r)) nav('/')
  }

  return (
    // ✅ Fixed: was "auth-pg" — must be "auth-page" to match the CSS
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your SHOP.CO account</p>

        {error && (
          <div style={{
            background: '#FFF1F1',
            color: 'var(--red)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {error as string}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          {/* ✅ Fixed: was "sub-btn" — must be "auth-btn" to match the CSS */}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* ✅ Fixed: was "auth-alt" — must be "auth-link" to match the CSS */}
        <div className="auth-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  )
}