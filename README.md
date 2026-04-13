# KitchenShare 🍽️

A local food sharing platform where home kitchens and restaurants post food for nearby customers to browse and pick up.

**Stack:** Django REST Framework (backend) + React (frontend)

---

## Project Structure

```
kitchenshare/
├── backend/                    # Django REST API
│   ├── manage.py               # Django CLI
│   ├── requirements.txt        # Python dependencies
│   ├── kitchendashboard/       # Django project settings
│   │   ├── settings.py         # CORS, DRF, media config
│   │   ├── urls.py             # Root URL routing
│   │   └── wsgi.py             # Production server
│   └── Inv/                    # Main app
│       ├── models.py           # Customer, Restaurant, Product, Order, Tag
│       ├── serializers.py      # JSON ↔ Model conversion
│       ├── views.py            # REST API endpoints
│       ├── urls.py             # API URL routing
│       └── admin.py            # Admin panel config
│
└── frontend/                   # React SPA
    ├── package.json
    ├── public/index.html
    └── src/
        ├── App.js              # Router + Auth context
        ├── api/api.js          # Axios API client
        ├── components/
        │   ├── Navbar.js       # Top navigation bar
        │   ├── Sidebar.js      # Collapsible side menu
        │   ├── FoodCarousel.js # Auto-scrolling food slider
        │   ├── FilterBar.js    # Tag/cuisine/price filters
        │   └── FoodCard.js     # Food listing card
        ├── pages/
        │   ├── Home.js         # Main browsing page
        │   ├── Login.js        # Login form
        │   ├── Signup.js       # Registration form
        │   ├── Dashboard.js    # Kitchen owner dashboard (dark theme)
        │   ├── CreateOffer.js  # Post new food offer
        │   ├── OfferDetail.js  # Single offer detail
        │   └── KitchenProfile.js # Restaurant profile
        └── styles/global.css
```

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Create admin account
python manage.py runserver        # Runs on http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm start                         # Runs on http://localhost:3000
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login (returns token) |
| GET | `/api/auth/profile/` | Get logged-in user profile |
| GET | `/api/products/?tags=1,2&cuisine=Indian` | Browse food with filters |
| POST | `/api/products/` | Create food offer (restaurant) |
| GET | `/api/restaurants/?search=Italian` | Search restaurants |
| GET | `/api/orders/` | List orders |
| POST | `/api/orders/` | Place order |
| GET | `/api/dashboard/stats/` | Dashboard statistics |

---

## Free Deployment Options

### Frontend → Vercel (Recommended)
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Set root directory to `frontend`
4. Set environment variable: `REACT_APP_API_URL=https://your-backend.railway.app/api`
5. Deploy — gives you a free `.vercel.app` domain

### Frontend → Netlify (Alternative)
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → Import from Git
3. Build command: `cd frontend && npm run build`
4. Publish directory: `frontend/build`
5. Add `_redirects` file in `frontend/public/`: `/* /index.html 200`

### Backend → Railway (Recommended)
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set root directory to `backend`
3. Add environment variables: `DJANGO_SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS=your-app.railway.app`
4. Railway auto-detects Django and deploys

### Backend → Render (Alternative)
1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo, set root to `backend`
3. Build command: `pip install -r requirements.txt && python manage.py migrate`
4. Start command: `gunicorn kitchendashboard.wsgi`

### Database → Railway PostgreSQL or Render PostgreSQL
Both offer free PostgreSQL. Update `settings.py` DATABASES to use `dj-database-url` in production.

---

## Design Decisions

- **Customer pages**: Beige/green warm palette (#f5efe3 + #1f5c3f)
- **Kitchen dashboard**: Dark theme (#000 + #0f1420) — visually distinct owner experience
- **Pickup only**: Removed delivery option as requested
- **Image uploads**: Restaurants upload food photos via Django ImageField → displayed in carousel
- **Tag filtering**: Products filtered by tags (Mexican, Vegan, etc.) via API query params
