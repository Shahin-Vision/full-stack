import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) { toast.success('Subscribed! 🎉'); setEmail('') }
  }

  return (
    <div className="newsletter-outer">
      <div className="newsletter-band">
        <div className="newsletter-inner">
          <h2 className="nl-heading">STAY UPTO DATE ABOUT<br />OUR LATEST OFFERS</h2>
          <form className="nl-form" onSubmit={subscribe}>
            <div className="nl-input-wrap">
              <svg className="nl-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,.6)" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input className="nl-input" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address" required />
            </div>
            <button className="nl-btn" type="submit">Subscribe to Newsletter</button>
          </form>
        </div>
      </div>
    </div>
  )
}
