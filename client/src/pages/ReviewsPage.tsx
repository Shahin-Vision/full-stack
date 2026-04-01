import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft } from 'lucide-react'
import { RootState, AppDispatch } from '../store'
import { fetchProduct } from '../store/slices/productsSlice'
import StarRating from '../components/StarRating'

export default function ReviewsPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { current: p, currentLoading } = useSelector((s: RootState) => s.products)

  useEffect(() => {
    if (id) dispatch(fetchProduct(+id))
  }, [id])

  if (currentLoading || !p) return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 18, color: 'var(--gray-400)' }}>Loading reviews…</div>
    </div>
  )

  return (
    <div className="reviews-page">

      {/* Back link */}
      <Link to={`/products/${p.id}`} className="reviews-back">
        <ArrowLeft size={18} />
        Back to {p.name}
      </Link>

      {/* Header */}
      <div className="reviews-header">
        <div className="reviews-header-left">
          <img
            src={p.image || 'https://placehold.co/80x80'}
            alt={p.name}
            className="reviews-product-img"
          />
          <div>
            <h1 className="reviews-title">Reviews</h1>
            <div style={{ fontSize: 15, color: 'var(--gray-600)', marginTop: 4 }}>{p.name}</div>
          </div>
        </div>

        {/* Summary */}
        <div className="reviews-summary">
          <div className="reviews-avg">{p.rating}</div>
          <StarRating rating={Number(p.rating)} size={22} />
          <div style={{ fontSize: 14, color: 'var(--gray-400)', marginTop: 6 }}>
            {p.review_count} {p.review_count === 1 ? 'Review' : 'Reviews'}
          </div>

          {/* Rating breakdown bars */}
          <div className="reviews-bars">
            {[5, 4, 3, 2, 1].map(star => {
              const count = p.reviews?.filter((r: any) => r.rating === star).length || 0
              const pct = p.reviews?.length ? Math.round((count / p.reviews.length) * 100) : 0
              return (
                <div key={star} className="reviews-bar-row">
                  <span className="reviews-bar-label">{star} ★</span>
                  <div className="reviews-bar-track">
                    <div className="reviews-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="reviews-bar-pct">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* All reviews list */}
      <div className="reviews-list">
        {p.reviews?.length ? (
          [...p.reviews]
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((r: any) => (
              <div key={r.id} className="review-card">
                <div className="review-card-top">
                  {/* Avatar */}
                  <div className="review-avatar">
                    {(r.user_name?.[0] || 'U').toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="review-author">{r.user_name}</div>
                    <StarRating rating={r.rating} size={14} />
                  </div>
                  <div className="review-date">
                    {new Date(r.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </div>
                </div>
                <p className="review-text">{r.text}</p>
              </div>
            ))
        ) : (
          <div className="reviews-empty">
            <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
            <p style={{ fontSize: 18, fontWeight: 600 }}>No reviews yet</p>
            <p style={{ color: 'var(--gray-400)', marginTop: 8 }}>
              Be the first to review this product.
            </p>
            <Link to={`/products/${p.id}`} className="atc-btn"
              style={{ display: 'inline-block', marginTop: 20, padding: '12px 28px', fontSize: 14 }}>
              Go Review It
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}