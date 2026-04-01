import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { RootState, AppDispatch } from '../store'
import { fetchProduct, fetchProducts } from '../store/slices/productsSlice'
import { addItem } from '../store/slices/cartSlice'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { current: p, items, currentLoading } = useSelector((s: RootState) => s.products)
  const { user, token } = useSelector((s: RootState) => s.auth)
  const [selColor, setSelColor] = useState('')
  const [selSize, setSelSize] = useState('')
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('details')
  const [mainImg, setMainImg] = useState(0)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(+id))
      dispatch(fetchProducts({ page_size: 5 }))
    }
  }, [id, token])

  useEffect(() => {
    if (p && user) {
      const name = `${user.first_name} ${user.last_name}`.trim() || user.email
      setAlreadyReviewed(p.reviews?.some((r: any) => r.user_name === name) ?? false)
    } else {
      setAlreadyReviewed(false)
    }
  }, [p?.id, p?.reviews, user])

  useEffect(() => {
    if (p) {
      setSelColor(p.colors?.[0] || '')
      setSelSize(p.sizes?.[0] || '')
      setMainImg(0)
    }
  }, [p?.id])

  const addToCart = () => {
    if (!p) return
    dispatch(addItem({
      id: p.id, name: p.name, price: p.price,
      image: p.image, quantity: qty, size: selSize, color: selColor
    }))
    toast.success(`${p.name} added to cart!`)
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewText.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/products/${p!.id}/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: reviewRating, text: reviewText }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (res.status === 400 && err.detail) {
          toast.error(err.detail)
        } else if (res.status === 401) {
          toast.error('Please sign in to submit a review.')
        } else {
          toast.error('Failed to submit review. Please try again.')
        }
        return
      }

      toast.success('Review submitted!')
      setReviewText('')
      setReviewRating(5)
      dispatch(fetchProduct(+id!))
    } catch {
      toast.error('Network error. Check your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  if (currentLoading || !p) return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 18, color: 'var(--gray-400)' }}>Loading…</div>
    </div>
  )

  const images = [
    p.image,
    p.image2_url || p.image,
    p.image3_url || p.image,
  ]

  return (
    <div className="pd-page">

      {/* Breadcrumb */}
      <div style={{ marginBottom: 20, fontSize: 14, color: 'var(--gray-400)' }}>
        <Link to="/" style={{ color: 'var(--gray-400)' }}>Home</Link> &gt;{' '}
        <Link to="/shop" style={{ color: 'var(--gray-400)' }}>Shop</Link> &gt;{' '}
        <span style={{ color: 'var(--black)', fontWeight: 600 }}>{p.name}</span>
      </div>

      {/* Gallery + Info */}
      <div className="pd-layout">

        {/* Gallery */}
        <div className="pd-gallery">
          <div className="thumbs">
            {images.map((img, i) => (
              <div
                key={i}
                className={`thumb ${mainImg === i ? 'sel' : ''}`}
                onClick={() => setMainImg(i)}
              >
                <img src={img || 'https://placehold.co/80x96'} alt="" />
              </div>
            ))}
          </div>
          <div className="main-img">
            <img src={images[mainImg] || 'https://placehold.co/500x500'} alt={p.name} />
          </div>
        </div>

        {/* Info */}
        <div className="pd-info">
          <h1 className="pd-title">{p.name}</h1>

          <div className="pd-meta">
            <StarRating rating={p.rating} size={16} />
            {/* Clicking rating goes to reviews page */}
            <Link
              to={`/products/${p.id}/reviews`}
              style={{ color: 'var(--gray-400)', fontSize: 14, textDecoration: 'none' }}
            >
              {p.rating}/5 ({p.review_count} Reviews)
            </Link>
          </div>

          <div className="pd-prices">
            <span className="pd-price">${p.price}</span>
            {p.original_price && <span className="price-old">${p.original_price}</span>}
            {p.discount > 0 && <span className="price-pct">-{p.discount}%</span>}
          </div>

          <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 22, fontSize: 15 }}>
            {p.description}
          </p>

          {/* Colors */}
          <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 18, marginBottom: 18 }}>
            <span className="sec-label">Select Colors</span>
            <div className="color-dots-lg">
              {p.colors?.map((c: string) => (
                <div
                  key={c}
                  className={`c-dot-lg ${selColor === c ? 'sel' : ''}`}
                  style={{ background: c, border: c === '#FFFFFF' ? '1px solid #ddd' : undefined }}
                  onClick={() => setSelColor(c)}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 18, marginBottom: 28 }}>
            <span className="sec-label">Choose Size</span>
            <div className="sz-pills-lg">
              {p.sizes?.map((s: string) => (
                <button
                  key={s}
                  className={`sz-pill-lg ${selSize === s ? 'sel' : ''}`}
                  onClick={() => setSelSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="cta-row">
            <div className="qty-box">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>
                <Minus size={16} />
              </button>
              <span className="qty-n">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>
                <Plus size={16} />
              </button>
            </div>
            <button className="atc-btn" onClick={addToCart}>Add to Cart</button>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="tabs-wrap">
        <div className="tab-hdrs">

          <button
            className={`tab-h ${tab === 'details' ? 'on' : ''}`}
            onClick={() => setTab('details')}
          >
            Product Details
          </button>

          {/* Reviews tab → navigates to dedicated reviews page */}
          <Link
            to={`/products/${p.id}/reviews`}
            className="tab-h"
            style={{ textDecoration: 'none' }}
          >
            Rating &amp; Reviews ({p.review_count})
          </Link>

          <button
            className={`tab-h ${tab === 'faqs' ? 'on' : ''}`}
            onClick={() => setTab('faqs')}
          >
            FAQs
          </button>

        </div>

        {/* Details tab */}
        {tab === 'details' && (
          <div style={{ color: 'var(--gray-600)', lineHeight: 1.8, fontSize: 15 }}>
            <p>{p.description}</p><br />
            <p>
              <strong>Style:</strong> {p.style}
              &nbsp;|&nbsp;
              <strong>Category:</strong> {p.category_name}
            </p><br />
            <p><strong>Available Colors:</strong> {p.colors?.length} options</p>
            <p><strong>Available Sizes:</strong> {p.sizes?.join(', ')}</p>
          </div>
        )}

        {/* FAQs tab */}
        {tab === 'faqs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'What is your return policy?',
              'How long does shipping take?',
              'Do you offer size exchanges?',
              'Is this product machine washable?'
            ].map(q => (
              <div key={q} style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{q}</div>
                <div style={{ color: 'var(--gray-600)', fontSize: 14 }}>
                  We offer 30-day hassle-free returns. Please contact our support team for assistance.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── WRITE A REVIEW (below tabs, always visible) ── */}
      <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--gray-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Integral CF','Arial Black',sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
            Write a Review
          </h2>
          <Link
            to={`/products/${p.id}/reviews`}
            style={{ fontSize: 14, fontWeight: 600, color: 'var(--black)', textDecoration: 'underline' }}
          >
            See all {p.review_count} reviews →
          </Link>
        </div>

        {user ? (
          alreadyReviewed ? (
            <div style={{
              background: 'var(--gray-100)', borderRadius: 16,
              padding: '16px 24px', fontSize: 14, color: 'var(--gray-600)',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <span style={{ fontSize: 20 }}>✓</span>
              You have already reviewed this product.{' '}
              <Link to={`/products/${p.id}/reviews`} style={{ color: 'var(--black)', fontWeight: 600 }}>
                View your review
              </Link>
            </div>
          ) : (
            <form onSubmit={submitReview} style={{
              background: 'var(--gray-100)', borderRadius: 16, padding: '20px 24px'
            }}>
              {/* Star picker */}
              <div style={{ marginBottom: 14 }}>
                <span className="sec-label" style={{ marginBottom: 8 }}>Your Rating</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      style={{
                        fontSize: 28, background: 'none', border: 'none',
                        cursor: 'pointer', padding: 0, lineHeight: 1,
                        color: star <= reviewRating ? '#FFB800' : 'var(--gray-200)',
                        transition: 'color .15s'
                      }}
                    >★</button>
                  ))}
                </div>
              </div>

              {/* Text */}
              <div style={{ marginBottom: 14 }}>
                <span className="sec-label" style={{ marginBottom: 8 }}>Your Review</span>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this product…"
                  rows={4}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    border: '1px solid var(--gray-200)', fontSize: 14,
                    outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                    boxSizing: 'border-box', background: 'var(--white)'
                  }}
                />
              </div>

              <button
                type="submit"
                className="atc-btn"
                disabled={submitting}
                style={{ padding: '13px 32px', fontSize: 15, opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          )
        ) : (
          <div style={{
            background: 'var(--gray-100)', borderRadius: 16,
            padding: '24px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
          }}>
            <span style={{ fontSize: 14, color: 'var(--gray-600)' }}>
              Sign in to leave a review
            </span>
            <Link to="/login" className="atc-btn" style={{ padding: '10px 24px', fontSize: 14 }}>
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Related products */}
      <section style={{ marginTop: 64 }}>
        <h2 className="section-title">YOU MIGHT ALSO LIKE</h2>
        <div className="products-grid">
          {items.filter((i: any) => i.id !== p.id).slice(0, 4).map((prod: any) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  )
}