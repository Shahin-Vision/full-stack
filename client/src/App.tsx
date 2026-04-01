import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import Header from './components/Header'
import Footer from './components/Footer'
import Newsletter from './components/Newsletter'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import ReviewsPage from './pages/ReviewsPage'

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((s: RootState) => s.auth)
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/shop"       element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/products/:id/reviews" element={<ReviewsPage />} />
          <Route path="/cart"       element={<Cart />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/checkout"   element={<Protected><Checkout /></Protected>} />
          <Route path="/orders"     element={<Protected><Orders /></Protected>} />
          <Route path="/profile"    element={<Protected><Profile /></Protected>} />
        </Routes>
      </main>
      {/* Newsletter sits directly above footer, both share white background */}
      <div className="footer-wrap">
        <Newsletter />
        <Footer />
      </div>
    </BrowserRouter>
  )
}
