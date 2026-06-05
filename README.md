# Kolo App - Full Stack Financial Management

> 💰 Smart bookkeeping and financial management app for African artisans and small business owners

**Kolo App** is a modern, full-stack financial management platform designed specifically for tailors, cobblers, welders, food vendors, hair braiders, and other small business owners in West Africa.

## ✨ Key Features

### 💵 Money Tracking
- Record income and expenses with categories
- Visualize financial summaries with charts
- Track daily, weekly, and monthly totals
- Voice input support for quick entry

### 👥 Customer Debt Book
- Manage customer profiles with photos
- Track outstanding debts
- Overdue debt alerts
- One-tap WhatsApp reminders

### 📦 Inventory Management
- Photo-based product tracking
- Low-stock alerts
- Quantity management
- Stock value calculation

### 🛡️ Anti-Scam Insights
- Market price benchmarks
- Profit margin calculator
- Transaction anomaly detection
- Fair pricing guidance

### 🔐 Trust & Share
- Biometric/PIN lock
- Export PDF reports
- Share with trusted contacts
- Secure data backup

## 🏗️ Architecture

This is a **monorepo** containing three applications:

### Backend API (`apps/api/`)
- **Framework:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JWT tokens
- **Features:** REST API, offline sync queue

### Web App (`apps/web/`)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Router:** React Router
- **State:** Context API

### Mobile App (`apps/mobile/`)
- **Framework:** React Native + Expo
- **Styling:** NativeWind (Tailwind)
- **Database:** SQLite (offline)
- **Notifications:** Expo Push

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- PostgreSQL 14+ (for production)

### Installation

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
bash setup.sh
```

### Running Locally

```bash
# Terminal 1: Start database
docker-compose up postgres

# Terminal 2: Start API (port 4000)
npm run dev:api

# Terminal 3: Start Web (port 5173)
npm run dev:web

# Terminal 4: Start Mobile
npm run dev:mobile
```

## 📚 Documentation

- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions
- **[API Documentation](apps/api/README.md)** - API endpoints and usage
- **[Web Setup](apps/web/README.md)** - Frontend setup
- **[Mobile Setup](apps/mobile/README.md)** - Mobile app setup
- **[Project PRD](PROJECT_PRD.md)** - Product requirements

## 🏃 Available Scripts

### Root Commands
```bash
npm install          # Install all dependencies
npm run install:all  # Clean install of all workspaces
npm run dev:api      # Start API dev server
npm run dev:web      # Start Web dev server  
npm run dev:mobile   # Start Mobile dev server
npm run start:api    # Start API production
```

### API Workspace
```bash
npm --workspace @kolo/api run dev    # Development
npm --workspace @kolo/api run start  # Production
npm --workspace @kolo/api test       # Run tests
```

### Web Workspace
```bash
npm --workspace @kolo/web run dev    # Dev server
npm --workspace @kolo/web run build  # Build for production
npm --workspace @kolo/web run preview # Preview production build
```

### Mobile Workspace
```bash
npm --workspace @kolo/mobile start   # Expo dev server
npm --workspace @kolo/mobile web     # Web preview
npm --workspace @kolo/mobile android # Build for Android
npm --workspace @kolo/mobile ios     # Build for iOS
```

## 🗂️ Project Structure

```
kolo-app/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── server.js
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   └── package.json
│   ├── web/
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── mobile/
│       ├── src/
│       ├── package.json
│       └── app.json
├── packages/
│   └── db/
│       ├── schema.sql
│       └── seed.sql
├── docker-compose.yml
├── .gitignore
├── DEPLOYMENT.md
└── package.json
```

## 🔧 Environment Setup

### API Environment
```bash
cp apps/api/.env.example apps/api/.env
# Configure database connection, JWT secret, etc.
```

### Web Environment
```bash
cp apps/web/.env.example apps/web/.env.local
# Configure API base URL
```

### Mobile Environment
```bash
cp apps/mobile/.env.example apps/mobile/.env.local
# Configure API base URL
```

## 🗄️ Database

### Initialize Database

**Windows:**
```bash
setup-db.bat
```

**macOS/Linux:**
```bash
bash setup-db.sh
```

### Database Schema
- `users` - User accounts
- `transactions` - Income/expenses
- `customers` - Customer profiles
- `debts` - Debt tracking
- `inventory_items` - Stock management
- `price_benchmarks` - Market price data

## 🚀 Deployment

### Docker
```bash
docker-compose up --build
```

### API Deployment
```bash
cd apps/api
npm run build
npm start
```

### Web Deployment
```bash
cd apps/web
npm run build
# Deploy dist/ folder to Vercel, Netlify, or any static host
```

### Mobile Deployment
```bash
cd apps/mobile
eas build --platform ios --auto-submit
eas build --platform android --auto-submit
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

### API Tests
```bash
npm --workspace @kolo/api run test
```

### Web Tests
```bash
npm --workspace @kolo/web run test
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Dashboard
- `GET /api/dashboard/summary` - Financial summary
- `GET /api/dashboard/trends` - Trends data

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - List transactions
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Customers & Debts
- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers
- `POST /api/debts` - Create debt
- `GET /api/debts` - List debts
- `POST /api/debts/:id/reminder` - Send reminder

### Inventory
- `POST /api/inventory` - Create item
- `GET /api/inventory` - List items
- `PUT /api/inventory/:id/quantity` - Update quantity
- `GET /api/inventory/low-stock` - Low stock items

### Market Pricing
- `GET /api/market/prices` - Get prices
- `POST /api/market/calculate-margin` - Calculate margin

## 🛠️ Tech Stack

### Frontend
- React 18.3
- Vite 5.4
- Tailwind CSS 3.4
- TypeScript 5.6
- React Router 6.28

### Backend
- Node.js 20+ (LTS)
- Express 4.19
- PostgreSQL 14+
- JWT (jsonwebtoken)
- bcryptjs

### Mobile
- React Native 0.76
- Expo 52
- NativeWind 4.1
- TypeScript 5.6
- SQLite (offline storage)

### DevOps
- Docker & Docker Compose
- PM2 (process management)
- GitHub Actions (CI/CD)

## 📱 Supported Platforms

- ✅ Web (Modern browsers)
- ✅ iOS (14+)
- ✅ Android (8+)

## 🔐 Security

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ Biometric support (mobile)
- ✅ PIN lock (mobile)

## 📈 Performance

- Optimized database queries with indexes
- Lazy loading for images
- Code splitting in web app
- SQLite offline cache on mobile
- API response caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

Kolo App © 2026. All rights reserved.

## 📞 Support

For issues, questions, or feature requests:
- Check [Troubleshooting](DEPLOYMENT.md#-troubleshooting)
- Review existing issues
- Create a new issue with detailed information

## 🎯 Roadmap

- [ ] SMS notifications (Twilio integration)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline-first data sync
- [ ] API rate limiting
- [ ] Advanced reporting

---

**Built with ❤️ for small business owners in Africa**

**Last Updated:** June 2, 2026

### Core API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/dashboard/summary`
- `GET /api/prices?region=Lagos`
- `POST /api/transactions`, `GET /api/transactions`
- `POST /api/customers`, `GET /api/customers`
- `POST /api/debts`
- `POST /api/inventory`, `GET /api/inventory`

## 4) Frontend Screens (React Native + Expo + NativeWind)

### Setup

1. From root: `npm install`
2. Start Expo app:
   - `npm run dev:mobile`

### Screens Implemented

- `OnboardingScreen`: auth input + business type picker + profile visual onboarding
- `DashboardScreen`: financial cards + trend placeholder + quick action FAB
- `MoneyTrackerScreen`: transaction entry + voice action + timeframe selector
- `DebtBookScreen`: customer debt cards + overdue tag + one-tap WhatsApp reminder
- `InventoryScreen`: stock cards + low-stock cue + stock value display
- `AntiScamScreen`: benchmark checker + margin snapshot + anomaly warning
- `TrustShareScreen`: biometric lock toggle + report/share section

## 5) Notes for Production Hardening

- Replace memory queue in `apps/mobile/src/services/offlineQueue.ts` with Expo SQLite backed queue and background retry.
- Add Twilio WhatsApp API in backend with automatic fallback to `wa.me` deep links on client.
- Wire `react-native-html-to-pdf` for downloadable PDF summaries.
- Add Expo push token registration + scheduled notifications for low stock and debt reminders.
- Add API request state machine in mobile (loading/success/error per endpoint).
