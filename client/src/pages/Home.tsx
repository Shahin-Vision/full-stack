import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { fetchProducts } from '../store/slices/productsSlice'
import ProductCard from '../components/ProductCard'
import StarRating from '../components/StarRating'
import toast from 'react-hot-toast'

import heroImg from '../assets/hero-image.jpg'
import casualImg from '../assets/styles/casual.png'
import formalImg from '../assets/styles/formal.png'
import partyImg from '../assets/styles/party.png'
import gymImg from '../assets/styles/gym.png'

const BRANDS = ['VERSACE', 'ZARA', 'GUCCI', 'PRADA', 'Calvin Klein']

const TESTIMONIALS = [
  { name:'Sarah M.', rating:5, text:"I'm blown away by the quality and style of clothes I received from Shop.co. From casual to elegant, every piece I've ordered has exceeded my expectations." },
  { name:'Alex K.',  rating:5, text:"Finding clothes that align with my values was a challenge until I discovered Shop.co. The variety is remarkable, catering to a variety of tastes and occasions." },
  { name:'James L.', rating:5, text:"As someone who's particular about style, Shop.co is a great find. Well-made clothes and the selection is not only diverse but also on-point with the latest trends." },
]

const STYLES = [
  { label:'Casual', img:casualImg, key:'casual' },
  { label:'Formal', img:formalImg, key:'formal' },
  { label:'Party',  img:partyImg,  key:'party'  },
  { label:'Gym',    img:gymImg,    key:'gym'     },
]

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const nav = useNavigate()
  const { items, loading } = useSelector((s:RootState) => s.products)
  const [email, setEmail] = useState('')

  useEffect(() => { dispatch(fetchProducts({ page_size: 8 })) }, [])

  const newArrivals = (items.filter(p => p.is_new).length ? items.filter(p => p.is_new) : items).slice(0,4)
  const topSelling  = (items.filter(p => p.is_sale || p.rating >= 4.5).length
    ? items.filter(p => p.is_sale || p.rating >= 4.5)
    : items.slice(4)).slice(0,4)

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) { toast.success('Subscribed! 🎉'); setEmail('') }
  }

  const Skeleton = () => (
    <div className="products-grid">
      {[...Array(4)].map((_,i) => (
        <div key={i}>
          <div className="ske ske-img" />
          <div className="ske ske-txt" />
          <div className="ske ske-txt ske-sm" />
        </div>
      ))}
    </div>
  )

  return (
    <div>
      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-wrap">
          <div className="hero-text">
            <h1 className="hero-h1">FIND CLOTHES<br />THAT MATCHES<br />YOUR STYLE</h1>
            <p className="hero-p">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of style.
            </p>
            <Link to="/shop" className="hero-btn">Shop Now</Link>
            <div className="hero-stats">
              <div className="hero-stat"><strong>200+</strong><span>International Brands</span></div>
              <div className="hero-stat"><strong>2,000+</strong><span>High-Quality Products</span></div>
              <div className="hero-stat"><strong>30,000+</strong><span>Happy Customers</span></div>
            </div>
          </div>
          <div className="hero-img">
            <img src={heroImg} alt="Fashion models" />
          </div>
        </div>
      </section>

      {/* ══ BRANDS ══ */}
      <div className="brands">
        <div className="brands-inner">
          {BRANDS.map(b => (
            <span key={b} className="brand" onClick={() => nav('/shop?brands=true')}>{b}</span>
          ))}
        </div>
      </div>

      {/* ══ NEW ARRIVALS ══ */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">NEW ARRIVALS</h2>
          {loading ? <Skeleton /> : (
            <div className="products-grid">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="see-all">
            <Link to="/shop?new=true" className="see-all-btn">View All</Link>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ TOP SELLING ══ */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">TOP SELLING</h2>
          {loading ? <Skeleton /> : (
            <div className="products-grid">
              {topSelling.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="see-all">
            <Link to="/shop?sale=true" className="see-all-btn">View All</Link>
          </div>
        </div>
      </section>

      {/* ══ BROWSE BY DRESS STYLE ══ */}
      <section className="styles-section">
        <div className="styles-inner">
          <h2 className="section-title">BROWSE BY DRESS STYLE</h2>
          <div className="styles-grid">
            {STYLES.map(s => (
              <div key={s.key} className="style-card" onClick={() => nav(`/shop?style=${s.key}`)}>
                <span className="style-label">{s.label}</span>
                <img src={s.img} alt={s.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">OUR HAPPY CUSTOMERS</h2>
          <div className="testi-grid">
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="testi-card">
                <StarRating rating={t.rating} />
                <div className="testi-name">{t.name}<span className="testi-check">✓</span></div>
                <p className="testi-text">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
