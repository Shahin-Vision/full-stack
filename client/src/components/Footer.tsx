import { Link } from 'react-router-dom'

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
)

/* ── Real SVG payment logos ── */
const VisaLogo = () => (
  <svg width="50" height="32" viewBox="0 0 50 32" fill="none">
    <rect width="50" height="32" rx="4" fill="white" stroke="#E6E6E6"/>
    <path d="M20.5 21H17.5L19.3 11H22.3L20.5 21Z" fill="#00579F"/>
    <path d="M30.2 11.3C29.6 11.1 28.6 10.9 27.4 10.9C24.6 10.9 22.6 12.4 22.6 14.5C22.6 16.1 24.1 17 25.2 17.5C26.3 18 26.7 18.3 26.7 18.8C26.7 19.5 25.8 19.8 25 19.8C23.8 19.8 23.2 19.6 22.2 19.2L21.8 19L21.4 21.6C22.1 21.9 23.4 22.2 24.8 22.2C27.8 22.2 29.7 20.8 29.7 18.5C29.7 17.3 28.9 16.4 27.2 15.6C26.2 15.1 25.6 14.8 25.6 14.2C25.6 13.8 26.1 13.3 27.4 13.3C28.4 13.3 29.1 13.5 29.7 13.7L30 13.9L30.2 11.3Z" fill="#00579F"/>
    <path d="M34 17.5C34.2 17 35.1 14.7 35.1 14.7C35.1 14.7 35.4 14 35.5 13.6L35.7 14.6C35.7 14.6 36.3 17.2 36.4 17.5H34ZM37.5 11H35.4C34.7 11 34.2 11.2 33.9 11.9L29.7 21H32.8L33.5 19H37.1C37.2 19.4 37.5 21 37.5 21H40.3L37.5 11Z" fill="#00579F"/>
    <path d="M15.2 11L12.5 17.9L12.2 16.4C11.6 14.6 9.9 12.7 8 11.7L10.5 21H13.7L18.5 11H15.2Z" fill="#00579F"/>
    <path d="M9.7 11H5.2L5.2 11.3C8.7 12.1 11 14.2 12 16.8L11 11.9C10.8 11.2 10.3 11 9.7 11Z" fill="#FAA61A"/>
  </svg>
)
const MastercardLogo = () => (
  <svg width="50" height="32" viewBox="0 0 50 32" fill="none">
    <rect width="50" height="32" rx="4" fill="white" stroke="#E6E6E6"/>
    <circle cx="19" cy="16" r="8" fill="#EB001B"/>
    <circle cx="31" cy="16" r="8" fill="#F79E1B"/>
    <path d="M25 9.5C26.9 11 28.2 13.4 28.2 16C28.2 18.6 26.9 21 25 22.5C23.1 21 21.8 18.6 21.8 16C21.8 13.4 23.1 11 25 9.5Z" fill="#FF5F00"/>
  </svg>
)
const PaypalLogo = () => (
  <svg width="50" height="32" viewBox="0 0 50 32" fill="none">
    <rect width="50" height="32" rx="4" fill="white" stroke="#E6E6E6"/>
    <path d="M33 12C33 15.2 30.8 17.2 27.8 17.2H26L25.3 21H22.5L24.4 10H29C31.3 10 33 11 33 12Z" fill="#009CDE"/>
    <path d="M18.5 10H23C26 10 28 11.5 27.6 14.5C27.2 17.5 25.1 19 22.1 19H20.4L19.7 22.8H17L18.5 10Z" fill="#003087"/>
    <path d="M21 16.5H22.6C24.3 16.5 25.5 15.6 25.7 13.8C25.9 12 24.8 11.2 23.1 11.2H21.5L21 16.5Z" fill="#009CDE"/>
  </svg>
)
const ApplePayLogo = () => (
  <svg width="50" height="32" viewBox="0 0 50 32" fill="none">
    <rect width="50" height="32" rx="4" fill="black"/>
    <path d="M18 10.5C18.6 9.8 19 8.9 18.9 8C18.1 8 17.1 8.5 16.5 9.2C15.9 9.8 15.5 10.8 15.6 11.7C16.5 11.7 17.4 11.2 18 10.5Z" fill="white"/>
    <path d="M18.9 11.9C17.6 11.8 16.5 12.6 15.8 12.6C15.1 12.6 14.2 11.9 13.1 11.9C11.6 11.9 10 12.8 9.2 14.3C7.6 17.3 8.8 21.8 10.4 24.3C11.2 25.5 12.1 26.8 13.3 26.8C14.5 26.8 14.9 26 16.3 26C17.7 26 18 26.8 19.3 26.8C20.5 26.8 21.4 25.5 22.2 24.3C23.1 22.9 23.5 21.5 23.5 21.4C23.5 21.4 21.1 20.5 21.1 17.9C21.1 15.6 23 14.6 23.1 14.5C21.9 12.7 20 11.9 18.9 11.9Z" fill="white"/>
    <text x="27" y="21" fill="white" fontFamily="Arial" fontSize="9" fontWeight="bold">Pay</text>
  </svg>
)
const GPayLogo = () => (
  <svg width="50" height="32" viewBox="0 0 50 32" fill="none">
    <rect width="50" height="32" rx="4" fill="white" stroke="#E6E6E6"/>
    <path d="M25.5 16.3c0 .5-.1 1-.2 1.4h-5.8v-.1c0-1.7 1.2-3.1 2.9-3.3.2 0 .4-.1.6-.1 1.4 0 2.5 1 2.5 2.1z" fill="#4285F4"/>
    <path d="M25.5 16.3H19.5c0 1.8 1.4 3.2 3.2 3.2.9 0 1.7-.4 2.3-1l1.1 1.1c-.9.8-2 1.3-3.4 1.3-2.6 0-4.7-2.1-4.7-4.6s2.1-4.6 4.7-4.6c1.3 0 2.4.5 3.3 1.3l-1.3 1.3c-.5-.5-1.2-.8-2-.8-1.4 0-2.6 1-2.8 2.3h6v.5z" fill="#4285F4"/>
    <path d="M33 11.5v9H31.5v-9H33z" fill="#34A853"/>
    <path d="M36.5 13.5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5zm0 1.5c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z" fill="#FBBC04"/>
    <path d="M36.5 13.5v1.5c-.6 0-1 .4-1 1v3.5H34v-3.5c0-1.4 1.1-2.5 2.5-2.5z" fill="#EA4335"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Brand col */}
        <div>
          <span className="f-logo">SHOP.CO</span>
          <p className="f-tag">We have clothes that suits your style and which you're proud to wear. From women to men.</p>
          <div className="f-social">
            <a href="#" className="social-a" aria-label="Twitter"><TwitterIcon /></a>
            <a href="#" className="social-a" aria-label="Facebook"><FacebookIcon /></a>
            <a href="#" className="social-a" aria-label="Instagram"><InstagramIcon /></a>
            <a href="#" className="social-a" aria-label="GitHub"><GithubIcon /></a>
          </div>
        </div>

        <div className="f-col">
          <h4>COMPANY</h4>
          <ul className="f-links">
            <li><Link to="/shop">About</Link></li>
            <li><Link to="/shop">Features</Link></li>
            <li><Link to="/shop">Works</Link></li>
            <li><Link to="/shop">Career</Link></li>
          </ul>
        </div>

        <div className="f-col">
          <h4>HELP</h4>
          <ul className="f-links">
            <li><Link to="/shop">Customer Support</Link></li>
            <li><Link to="/shop">Delivery Details</Link></li>
            <li><Link to="/shop">Terms &amp; Conditions</Link></li>
            <li><Link to="/shop">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="f-col">
          <h4>FAQ</h4>
          <ul className="f-links">
            <li><Link to="/shop">Account</Link></li>
            <li><Link to="/shop">Manage Deliveries</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/shop">Payments</Link></li>
          </ul>
        </div>

        <div className="f-col">
          <h4>RESOURCES</h4>
          <ul className="f-links">
            <li><Link to="/shop">Free eBooks</Link></li>
            <li><Link to="/shop">Development Tutorial</Link></li>
            <li><Link to="/shop">How to - Blog</Link></li>
            <li><Link to="/shop">Youtube Playlist</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bot">
        <p className="f-copy">Shop.co © 2000-2023, All Rights Reserved</p>
        <div className="f-pays">
          <VisaLogo />
          <MastercardLogo />
          <PaypalLogo />
          <ApplePayLogo />
          <GPayLogo />
        </div>
      </div>
    </footer>
  )
}
