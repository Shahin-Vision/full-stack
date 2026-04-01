export default function StarRating({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div className="stars" style={{ fontSize: size }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star ${rating >= i ? 'on' : rating >= i-0.5 ? 'half' : ''}`}>★</span>
      ))}
    </div>
  )
}
