import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { CheckCircle } from 'lucide-react'
import { RootState, AppDispatch } from '../store'
import { createOrder } from '../store/slices/ordersSlice'
import { clearCart } from '../store/slices/cartSlice'

const STEPS = ['Shipping', 'Payment', 'Review']

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>()
  const nav = useNavigate()
  const { items, discount } = useSelector((s: RootState) => s.cart)
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [payment, setPayment] = useState('card')
  const [placing, setPlacing] = useState(false)
  const [ship, setShip] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'India'
  })

  const up = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setShip({ ...ship, [k]: e.target.value })

  const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0)
  const discAmt  = (subtotal * discount) / 100
  const delivery = 15
  const total    = subtotal - discAmt + delivery

  // ── Fixed placeOrder ──
  const placeOrder = async () => {
    setPlacing(true)
    const orderData = {
      shipping_address: ship,
      payment_method:   payment,
      total_amount:     total.toFixed(2),
      subtotal:         subtotal.toFixed(2),
      delivery_fee:     delivery,
      discount_amount:  discAmt.toFixed(2),
      items: items.map(i => ({
        product_id:    i.id,
        product_name:  i.name,
        product_image: i.image || '',   // ✅ never null
        quantity:      i.quantity,
        price:         i.price,
        size:          i.size  || '',   // ✅ never null
        color:         i.color || '',   // ✅ never null
      }))
    }
    const r = await dispatch(createOrder(orderData))
    setPlacing(false)
    if (createOrder.fulfilled.match(r)) {
      dispatch(clearCart())
      setDone(true)
    } else {
      // ✅ Show actual Django error message
      const errMsg = r.payload as string
      toast.error(errMsg || 'Failed to place order. Please try again.')
    }
  }

  /* ── Order placed confirmation ── */
  if (done) return (
    <div className="co-page">
      <div style={{
        textAlign: 'center', padding: '64px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
      }}>
        <CheckCircle size={64} color="var(--green)" />
        <h2 style={{
          fontFamily: "'Integral CF','Arial Black',sans-serif",
          fontSize: 28, fontWeight: 700
        }}>
          Order Placed!
        </h2>
        <p style={{ color: 'var(--gray-600)', fontSize: 15 }}>
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
          <button className="co-btn"
            style={{ width: 'auto', padding: '14px 32px' }}
            onClick={() => nav('/orders')}>
            View Orders
          </button>
          <button className="co-btn"
            style={{ width: 'auto', padding: '14px 32px', background: 'var(--white)', color: 'var(--black)', border: '1px solid var(--gray-200)' }}
            onClick={() => nav('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
  
  /* ── Order summary panel ── */
  const SummaryPanel = () => (
    <div className="co-card">
      <h3>Order Summary</h3>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
          <div style={{
            width: 50, height: 62, borderRadius: 8, overflow: 'hidden',
            background: 'var(--gray-100)', flexShrink: 0
          }}>
            <img src={item.image || 'https://placehold.co/50x62'} alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, fontSize: 13 }}>
            <div style={{ fontWeight: 600 }}>{item.name}</div>
            <div style={{ color: 'var(--gray-400)' }}>×{item.quantity} · {item.size}</div>
          </div>
          <div style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      ))}

      <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 12, marginTop: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
          <span style={{ color: 'var(--gray-600)' }}>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: 'var(--gray-600)' }}>Discount</span>
            <span style={{ color: 'var(--red)' }}>-${discAmt.toFixed(2)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
          <span style={{ color: 'var(--gray-600)' }}>Delivery</span>
          <span>${delivery}</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          paddingTop: 12, borderTop: '1px solid var(--gray-100)',
          fontWeight: 700, fontSize: 16
        }}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="co-page">
      <h1 className="co-title">Checkout</h1>

      {/* ── Step indicator ── */}
      <div className="co-steps">
        {STEPS.map((s, i) => (
          <>
            <div
              key={s}
              className={`step-item ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}
            >
              <div className="step-num">
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div key={`sep-${i}`} className="step-sep" />
            )}
          </>
        ))}
      </div>

      <div className="co-layout">

        {/* ── Main form ── */}
        <div className="co-main">

          {/* Step 1 — Shipping */}
          {step === 1 && (
            <div className="co-card">
              <h3>Shipping Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="co-field">
                  <label>First Name</label>
                  <input required value={ship.first_name} onChange={up('first_name')} placeholder="John" />
                </div>
                <div className="co-field">
                  <label>Last Name</label>
                  <input required value={ship.last_name} onChange={up('last_name')} placeholder="Doe" />
                </div>
              </div>
              <div className="co-field">
                <label>Email</label>
                <input type="email" required value={ship.email} onChange={up('email')} placeholder="john@example.com" />
              </div>
              <div className="co-field">
                <label>Phone</label>
                <input value={ship.phone} onChange={up('phone')} placeholder="+91 000 000 0000" />
              </div>
              <div className="co-field">
                <label>Address</label>
                <input required value={ship.address} onChange={up('address')} placeholder="123 Street, Area" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="co-field">
                  <label>City</label>
                  <input required value={ship.city} onChange={up('city')} placeholder="Mumbai" />
                </div>
                <div className="co-field">
                  <label>State</label>
                  <input value={ship.state} onChange={up('state')} placeholder="Maharashtra" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="co-field">
                  <label>Postal Code</label>
                  <input value={ship.zip} onChange={up('zip')} placeholder="400001" />
                </div>
                <div className="co-field">
                  <label>Country</label>
                  <input value={ship.country} onChange={up('country')} />
                </div>
              </div>
              <button className="co-btn" onClick={() => {
                if (!ship.first_name || !ship.email || !ship.address || !ship.city) {
                  toast.error('Please fill all required fields')
                  return
                }
                setStep(2)
              }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div className="co-card">
              <h3>Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {[
                  { v: 'card',      l: '💳 Credit / Debit Card' },
                  { v: 'upi',       l: '📱 UPI' },
                  { v: 'googlepay', l: '🔵 Google Pay' },
                ].map(o => (
                  <div
                    key={o.v}
                    onClick={() => setPayment(o.v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 18px', borderRadius: 14, cursor: 'pointer',
                      border: `2px solid ${payment === o.v ? 'var(--black)' : 'var(--gray-200)'}`,
                      background: payment === o.v ? 'var(--gray-100)' : 'var(--white)',
                      transition: 'all .15s'
                    }}
                  >
                    <input type="radio" readOnly checked={payment === o.v}
                      style={{ accentColor: 'var(--black)', width: 16, height: 16 }} />
                    <span style={{ fontSize: 15, fontWeight: 500 }}>{o.l}</span>
                  </div>
                ))}
              </div>

              {payment === 'card' && (
                <>
                  <div className="co-field">
                    <label>Card Number</label>
                    <input placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="co-field">
                      <label>Expiry Date</label>
                      <input placeholder="MM/YY" />
                    </div>
                    <div className="co-field">
                      <label>CVV</label>
                      <input placeholder="•••" maxLength={4} />
                    </div>
                  </div>
                </>
              )}
              {payment === 'upi' && (
                <div className="co-field">
                  <label>UPI ID</label>
                  <input placeholder="yourname@upi" />
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button onClick={() => setStep(1)} className="co-btn"
                  style={{ flex: 1, background: 'var(--white)', color: 'var(--black)', border: '1px solid var(--gray-200)' }}>
                  ← Back
                </button>
                <button onClick={() => setStep(3)} className="co-btn" style={{ flex: 2 }}>
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <div className="co-card">
              <h3>Review Your Order</h3>

              <div style={{ background: 'var(--gray-100)', borderRadius: 14, padding: 18, marginBottom: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>Shipping To</div>
                <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 }}>
                  {ship.first_name} {ship.last_name}<br />
                  {ship.address}, {ship.city}, {ship.state} {ship.zip}<br />
                  {ship.country}<br />
                  {ship.email}
                </p>
              </div>

              <div style={{ background: 'var(--gray-100)', borderRadius: 14, padding: 18, marginBottom: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>Payment Method</div>
                <p style={{ fontSize: 14, color: 'var(--gray-600)' }}>
                  {payment === 'card' ? '💳 Credit/Debit Card'
                    : payment === 'upi' ? '📱 UPI'
                    : '🔵 Google Pay'}
                </p>
              </div>

              {/* Items preview in review step */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
                  Items ({items.length})
                </div>
                {items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    paddingBottom: 10, marginBottom: 10,
                    borderBottom: i < items.length - 1 ? '1px solid var(--gray-100)' : 'none'
                  }}>
                    <div style={{
                      width: 42, height: 52, borderRadius: 8, overflow: 'hidden',
                      background: 'var(--gray-100)', flexShrink: 0
                    }}>
                      <img src={item.image || 'https://placehold.co/42x52'} alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, fontSize: 13 }}>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ color: 'var(--gray-400)' }}>×{item.quantity} · {item.size}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(2)} className="co-btn"
                  style={{ flex: 1, background: 'var(--white)', color: 'var(--black)', border: '1px solid var(--gray-200)' }}>
                  ← Back
                </button>
                <button
                  className="co-btn"
                  style={{ flex: 2, opacity: placing ? 0.6 : 1 }}
                  disabled={placing}
                  onClick={placeOrder}
                >
                  {placing ? 'Placing Order…' : `Place Order · $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Side summary ── */}
        <div className="co-side">
          <SummaryPanel />
        </div>
      </div>
    </div>
  )
}