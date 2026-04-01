import { useNavigate } from 'react-router-dom'
import StarRating from './StarRating'
import { Product } from '../store/slices/productsSlice'

function img(src: string) {
  if (!src) return 'https://placehold.co/300x400?text=Product'
  return src
}

export default function ProductCard({ product: p }: { product: Product }) {
  const nav = useNavigate()
  return (
    <div className="p-card" onClick={() => nav(`/product/${p.id}`)}>
      <div className="p-card-img">
        <img src={img(p.image)} alt={p.name} loading="lazy" />
        {p.is_new && <span className="p-badge new">New</span>}
        {p.is_sale && !p.is_new && <span className="p-badge sale">Sale</span>}
      </div>
      <div className="p-name">{p.name}</div>
      <div className="p-rating">
        <StarRating rating={p.rating} />
        <span>{p.rating}/5</span>
      </div>
      <div className="p-price">
        <span className="price-now">${p.price}</span>
        {p.original_price && <span className="price-old">${p.original_price}</span>}
        {p.discount > 0 && <span className="price-pct">-{p.discount}%</span>}
      </div>
    </div>
  )
}
