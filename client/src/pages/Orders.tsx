import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { RootState, AppDispatch } from '../store'
import { fetchOrders } from '../store/slices/ordersSlice'

const STATUS_CLASS: Record<string, string> = {
  pending: 'pending', processing: 'processing', shipped: 'shipped',
  delivered: 'delivered', cancelled: 'cancelled'
}

export default function Orders() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading } = useSelector((s: RootState) => s.orders)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => { dispatch(fetchOrders()) }, [])

  if (loading) return (
    <div className="orders-page">
      <div style={{ color: 'var(--gray-400)' }}>Loading your orders…</div>
    </div>
  )

  return (
    <div className="orders-page">
      <h1 className="ord-title">MY ORDERS</h1>

      {!items.length ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <p style={{ fontSize: 18 }}>No orders yet</p>
          <p style={{ marginTop: 8, marginBottom: 22 }}>Start shopping to see your orders here.</p>
          <a href="/shop" className="hero-btn" style={{ display: 'inline-block' }}>Shop Now</a>
        </div>
      ) : items.map((order: any) => (
        <div key={order.id} className="ord-card">

          {/* Header row */}
          <div
            className="ord-hdr"
            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
          >
            <div>
              <div className="ord-id">Order #{order.id}</div>
              <div className="ord-date">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </div>
            </div>

            <span className={`ord-status ${STATUS_CLASS[order.status] || 'pending'}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>

            <div style={{ fontWeight: 700, fontSize: 16 }}>
              ${parseFloat(order.total_amount).toFixed(2)}
            </div>

            {expanded === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>

          {/* Expanded body */}
          {expanded === order.id && (
            <div className="ord-body">
              <div className="ord-items">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="ord-item">
                    <div className="ord-item-img">
                      <img
                        src={item.product_image || 'https://placehold.co/60x76'}
                        alt={item.product_name}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="ord-item-name">{item.product_name}</div>
                      <div className="ord-item-meta">Size: {item.size} | Qty: {item.quantity}</div>
                      <div style={{ fontWeight: 700, marginTop: 4 }}>
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ord-total" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 13, color: 'var(--gray-600)' }}>
                <span>Payment: {order.payment_method?.toUpperCase()}</span>
                <span>Delivery: ${parseFloat(order.delivery_fee || 15).toFixed(2)}</span>
                <span style={{ fontWeight: 700, color: 'var(--black)' }}>
                  Total: ${parseFloat(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          )}

        </div>
      ))}
    </div>
  )
}