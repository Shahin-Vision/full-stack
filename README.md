# SHOP.CO — Full-Stack E-Commerce Platform

A pixel-perfect, fully responsive e-commerce app built with **React + Redux + Django REST + PostgreSQL**.

---

## 🚀 Quick Start

### Backend (Django)

```bash
cd server
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy and fill in your DB credentials
cp .env.example .env

python manage.py makemigrations
python manage.py migrate

# Seed 100 products + demo accounts
python manage.py seed_data

python manage.py runserver        # → http://localhost:8000
```

### Frontend (React + Vite)

```bash
cd client
npm install
npm run dev                        # → http://localhost:5173
```

---

## 🔑 Demo Accounts

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@shopco.com     | admin123  |
| User  | demo@shopco.com      | demo1234  |

Django Admin: http://localhost:8000/admin/

---

## 🛒 Promo Codes

| Code    | Discount |
|---------|----------|
| SAVE20  | 20% off  |
| SHOP10  | 10% off  |
| FIRST15 | 15% off  |

---

## 🏗️ Architecture

### Frontend Stack
- **React 18** + **TypeScript** + **Vite**
- **Redux Toolkit** — global state (auth, cart, products, orders)
- **React Router v6** — routing with protected routes
- **Axios** — API calls with JWT interceptors
- **react-hot-toast** — notifications

### Backend Stack
- **Django 4.2** + **Django REST Framework**
- **SimpleJWT** — JWT authentication
- **PostgreSQL** — database
- **django-filter** — advanced product filtering

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | No | Register new user |
| POST | `/api/auth/login/` | No | Login → JWT tokens |
| POST | `/api/auth/token/refresh/` | No | Refresh access token |
| GET/PUT | `/api/auth/profile/` | ✅ | View/edit profile |
| **GET** | `/api/products/` | No | List products (filter/sort/search/paginate) |
| **GET** | `/api/products/:id/` | No | Product detail + reviews |
| GET | `/api/products/categories/` | No | All categories |
| POST | `/api/products/:id/reviews/` | ✅ | Add review |
| POST | `/api/cart/` | ✅ | Cart sync (Redux primary) |
| **GET** | `/api/orders/` | ✅ | User's order history |
| POST | `/api/orders/` | ✅ | Place new order |
| GET | `/api/orders/:id/` | ✅ | Order detail |

### Product Query Params
`search`, `style`, `is_new`, `is_sale`, `min_price`, `max_price`, `category`, `ordering` (-price/price/-rating/-created_at), `page`, `page_size`

---

## 🎨 Features

- ✅ 100 seeded products across 11 categories
- ✅ Full Redux state management (auth, cart, products, orders)
- ✅ JWT authentication with auto-refresh
- ✅ Protected routes (Checkout, Orders, Profile)
- ✅ Advanced product filtering (style, price, size, color)
- ✅ Working promo codes
- ✅ 3-step checkout (Shipping → Payment → Review)
- ✅ Order history with expandable details
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Sticky navbar, working mobile hamburger menu
- ✅ Fixed footer with payment icons
- ✅ Hardcoded hero and style images from Figma
