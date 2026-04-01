import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Trash2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { RootState, AppDispatch } from '../store'
import { removeItem, updateQuantity, applyPromo } from '../store/slices/cartSlice'

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>()
  const nav = useNavigate()
  const { items, promoCode, discount } = useSelector((s: RootState) => s.cart)
  const [promo, setPromo] = useState('')

  const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0)
  const discountAmt = (subtotal * discount) / 100
  const delivery = subtotal > 0 ? 15 : 0
  const total = subtotal - discountAmt + delivery

  const doPromo = () => {
    const code = promo.toUpperCase()
    dispatch(applyPromo(promo))
    if (['SAVE20','SHOP10','FIRST15'].includes(code)) toast.success(`Code "${code}" applied!`)
    else toast.error('Invalid promo code')
    setPromo('')
  }

  if (!items.length) return (
    <div className="cart-page">
      <h1 className="cart-title">YOUR CART</h1>
      <div className="empty-cart">
        <div style={{ fontSize:48, marginBottom:16 }}>🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="hero-btn" style={{ display:'inline-block' }}>Continue Shopping</Link>
      </div>
    </div>
  )

  return (
    <div className="cart-page">
      <h1 className="cart-title">YOUR CART</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item, idx) => (
            <div key={idx} className="cart-item">
              <div className="c-img" onClick={() => nav(`/product/${item.id}`)}>
                <img src={item.image || 'https://placehold.co/90x116'} alt={item.name} />
              </div>
              <div className="c-body">
                <div>
                  <div className="c-name">{item.name}</div>
                  <div className="c-meta">
                    Size: <strong>{item.size}</strong> &nbsp;|&nbsp; Color:{' '}
                    <span style={{ display:'inline-block', width:14, height:14, background:item.color, borderRadius:'50%', border:'1px solid #ccc', verticalAlign:'middle', marginLeft:4 }} />
                  </div>
                </div>
                <div className="c-footer">
                  <span className="c-price">${(item.price * item.quantity).toFixed(2)}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div className="qty-box">
                      <button className="qty-btn" onClick={() => dispatch(updateQuantity({ id:item.id, size:item.size, color:item.color, quantity:item.quantity-1 }))}>−</button>
                      <span className="qty-n">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => dispatch(updateQuantity({ id:item.id, size:item.size, color:item.color, quantity:item.quantity+1 }))}>+</button>
                    </div>
                    <button className="del-btn" onClick={() => dispatch(removeItem({ id:item.id, size:item.size, color:item.color }))}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="order-box">
          <div className="o-inner">
            <div className="o-title">Order Summary</div>
            <div className="o-row"><span className="o-label">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="o-row"><span className="o-label">Discount (-{discount}%)</span><span className="o-disc">-${discountAmt.toFixed(2)}</span></div>}
            <div className="o-row"><span className="o-label">Delivery Fee</span><span>${delivery.toFixed(2)}</span></div>
            <div className="o-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <div className="promo-wrap">
              <input className="promo-in" value={promo} onChange={e => setPromo(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doPromo()}
                placeholder="Add promo code" />
              <button className="promo-btn" onClick={doPromo}>Apply</button>
            </div>
            {promoCode && <div style={{ fontSize:13, color:'#01AB31', marginBottom:8 }}>✓ Code "{promoCode}" applied!</div>}
            <p style={{ fontSize:12, color:'#9F9F9F', marginBottom:12 }}>Try: SAVE20 · SHOP10 · FIRST15</p>
            <button className="go-btn" onClick={() => nav('/checkout')}>
              Go to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
