import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, Search, User, Menu, X, ChevronDown } from 'lucide-react'
import { RootState, AppDispatch } from '../store'
import { logout } from '../store/slices/authSlice'

const SHOP_CATEGORIES = [
  { label: 'Casual',    to: '/shop?style=casual' },
  { label: 'Formal',    to: '/shop?style=formal' },
  { label: 'Party',     to: '/shop?style=party' },
  { label: 'Gym',       to: '/shop?style=gym' },
]

export default function Header() {
  const nav = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((s: RootState) => s.auth)
  const { items } = useSelector((s: RootState) => s.cart)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [userOpen,  setUserOpen]  = useState(false)
  const [shopOpen,  setShopOpen]  = useState(false)
  const [annOpen,   setAnnOpen]   = useState(true)
  const [q, setQ] = useState('')

  const uRef    = useRef<HTMLDivElement>(null)
  const shopRef = useRef<HTMLDivElement>(null)
  const cartCount = items.reduce((a, b) => a + b.quantity, 0)

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (uRef.current    && !uRef.current.contains(e.target as Node))    setUserOpen(false)
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShopOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) { nav(`/shop?search=${encodeURIComponent(q.trim())}`); setQ(''); setMenuOpen(false) }
  }

  return (
    <div>
      {annOpen && (
        <div className="ann-bar">
          Sign up and get 20% off to your first order.
          <Link to="/register"> Sign Up Now</Link>
          <button className="ann-close" onClick={() => setAnnOpen(false)}>×</button>
        </div>
      )}

      <nav className="navbar">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">SHOP.CO</Link>

          {/* Desktop links */}
          <ul className="nav-links">
            {/* Shop with dropdown */}
            <li ref={shopRef} style={{ position: 'relative' }}>
              <button
                className="nav-shop-btn"
                onClick={() => setShopOpen(o => !o)}
                aria-expanded={shopOpen}
              >
                Shop <ChevronDown size={13} style={{ transition: 'transform .2s', transform: shopOpen ? 'rotate(180deg)' : 'none' }} />
              </button>
              {shopOpen && (
                <div className="shop-dropdown">
                  <div className="sd-section">
                    <div className="sd-label">Categories</div>
                    {SHOP_CATEGORIES.map(c => (
                      <Link key={c.label} to={c.to}
                        className="sd-link"
                        onClick={() => setShopOpen(false)}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                  <div className="sd-divider" />
                  <Link to="/shop" className="sd-viewall" onClick={() => setShopOpen(false)}>
                    View All Products →
                  </Link>
                </div>
              )}
            </li>
            <li><Link to="/shop?sale=true">On Sale</Link></li>
            <li><Link to="/shop?new=true">New Arrivals</Link></li>
            <li><Link to="/shop?brands=true">Brands</Link></li>
          </ul>

          {/* Search */}
          <form className="nav-search" onSubmit={search}>
            <Search size={16} color="#9F9F9F" style={{ flexShrink: 0 }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search for products…" />
          </form>

          {/* Icons */}
          <div className="nav-actions">
            <button className="nav-icon" onClick={() => nav('/cart')} aria-label="Cart">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            <div className="u-drop" ref={uRef}>
              <button className="nav-icon" onClick={() => setUserOpen(o => !o)} aria-label="Account">
                <User size={22} />
              </button>
              {userOpen && (
                <div className="u-menu">
                  {user ? (
                    <>
                      <Link to="/profile" onClick={() => setUserOpen(false)}>
                        <User size={14} /> {user.first_name || 'Profile'}
                      </Link>
                      <Link to="/orders" onClick={() => setUserOpen(false)}>
                        <ShoppingCart size={14} /> My Orders
                      </Link>
                      <button onClick={() => { dispatch(logout()); nav('/'); setUserOpen(false) }}>
                        <X size={14} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setUserOpen(false)}>Sign In</Link>
                      <Link to="/register" onClick={() => setUserOpen(false)}>Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button className="hamburger nav-icon" onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
          <div style={{ padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#9F9F9F', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 4 }}>Shop</div>
            {SHOP_CATEGORIES.map(c => (
              <Link key={c.label} to={c.to} onClick={() => setMenuOpen(false)}
                style={{ padding: '8px 0', display: 'block', fontSize: 15, borderBottom: 'none' }}>
                {c.label}
              </Link>
            ))}
          </div>
          <Link to="/shop?sale=true"   onClick={() => setMenuOpen(false)}>On Sale</Link>
          <Link to="/shop?new=true"    onClick={() => setMenuOpen(false)}>New Arrivals</Link>
          <Link to="/shop?brands=true" onClick={() => setMenuOpen(false)}>Brands</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
              <Link to="/orders"  onClick={() => setMenuOpen(false)}>My Orders</Link>
              <Link to="/cart"    onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>
              <button className="m-link" onClick={() => { dispatch(logout()); nav('/'); setMenuOpen(false) }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Create Account</Link>
            </>
          )}
          <form className="m-search" onSubmit={search}>
            <Search size={15} color="#9F9F9F" style={{ flexShrink: 0 }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search for products…" />
          </form>
        </div>
      </nav>
    </div>
  )
}
