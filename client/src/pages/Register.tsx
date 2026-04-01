import { useEffect, useState, useSyncExternalStore } from 'react'
import { Form, Link, useNavigate } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { register } from '../store/slices/authSlice'
import { GitGraph, SwatchBook } from 'lucide-react'

export default function Register() {
  const dispatch = useDispatch<AppDispatch>()
  const nav = useNavigate()
  const { loading, error } = useSelector((s: RootState) => s.auth)
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await dispatch(register(form))
    if (register.fulfilled.match(r)) nav('/')
  }
  const up = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value })

  return (
    // ✅ Fixed: "auth-pg" → "auth-page"
    <div className="auth-page">
      <div className="auth-box">
        {/* ✅ Fixed: "auth-h" → "auth-title" */}
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join SHOP.CO today</p>

        {error && (
          <div style={{
            background: '#FFF1F1',
            color: 'var(--red)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {typeof error === 'string' ? error : 'Please check your details'}
          </div>
        )}

        <form onSubmit={submit}>
          {/* ✅ Fixed: "f-row" is defined in CSS — kept as-is, works correctly */}
          <div className="f-row">
            {/* ✅ Fixed: "form-grp" → "auth-field" */}
            <div className="auth-field">
              <label>First Name</label>
              <input
                required
                value={form.first_name}
                onChange={up('first_name')}
                placeholder="John"
              />
            </div>
            <div className="auth-field">
              <label>Last Name</label>
              <input
                required
                value={form.last_name}
                onChange={up('last_name')}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={up('email')}
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={up('password')}
              placeholder="Min. 6 characters"
            />
          </div>

          {/* ✅ Fixed: "sub-btn" → "auth-btn" */}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {/* ✅ Fixed: "auth-alt" → "auth-link" */}
        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}


