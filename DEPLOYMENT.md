# Kolo App - Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Project Structure](#project-structure)
4. [Running Locally](#running-locally)
5. [Database Setup](#database-setup)
6. [API Deployment](#api-deployment)
7. [Web Deployment](#web-deployment)
8. [Mobile Deployment](#mobile-deployment)
9. [Environment Variables](#environment-variables)
10. [Troubleshooting](#troubleshooting)

## 📦 Prerequisites

### Required
- **Node.js** 18.x or later
- **npm** 8.x or later
- **PostgreSQL** 14+ (for production)
- **Git**

### Optional
- **Docker** & **Docker Compose** (for containerized setup)
- **PM2** (for production process management)

### Verify Installation
```bash
node --version    # Should be v18+
npm --version     # Should be 8+
psql --version    # If PostgreSQL is installed
```

## 🚀 Development Setup

### 1. Clone and Install Dependencies

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
bash setup.sh
```

Or manually:
```bash
npm install
npm --workspace @kolo/api install
npm --workspace @kolo/web install
npm --workspace @kolo/mobile install
```

### 2. Configure Environment Variables

**API:**
```bash
cd apps/api
cp .env.example .env
# Edit .env with your configuration
```

**Web:**
```bash
cd apps/web
cp .env.example .env.local
```

**Mobile:**
```bash
cd apps/mobile
cp .env.example .env.local
```

## 📁 Project Structure

```
kolo-app/
├── apps/
│   ├── api/              # Node.js + Express API server
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
│   ├── web/              # React + Vite frontend
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── mobile/           # React Native + Expo
│       ├── src/
│       ├── app.json
│       └── package.json
├── packages/
│   └── db/
│       ├── schema.sql
│       └── seed.sql
├── docker-compose.yml
├── setup.sh / setup.bat
├── setup-db.sh / setup-db.bat
└── README.md
```

## 🏃 Running Locally

### Option 1: Using Individual Terminals

**Terminal 1 - Start Database:**
```bash
# Using Docker Compose (recommended)
docker-compose up -d postgres

# Or using local PostgreSQL
psql -U postgres
```

**Terminal 2 - Start API:**
```bash
npm run dev:api
# Runs on http://localhost:4000
# Health check: http://localhost:4000/health
```

**Terminal 3 - Start Web:**
```bash
npm run dev:web
# Runs on http://localhost:5173
```

**Terminal 4 - Start Mobile (optional):**
```bash
npm run dev:mobile
# Runs on http://localhost:8081
```

### Option 2: Using Docker Compose

```bash
docker-compose up
# Starts all services with one command
# Database: localhost:5432
# API: localhost:4000
# Database admin: pgAdmin on localhost:5050 (if included)
```

## 🗄️ Database Setup

### Option 1: Using Setup Scripts

**Windows:**
```bash
setup-db.bat
```

**macOS/Linux:**
```bash
bash setup-db.sh
```

### Option 2: Manual Setup

```bash
# Create database
createdb kolo_db

# Run schema
psql -U postgres -d kolo_db -f packages/db/schema.sql

# Run seed data
psql -U postgres -d kolo_db -f packages/db/seed.sql
```

### Option 3: Using Docker

```bash
docker-compose up postgres
# Wait for service to be healthy, then:
docker-compose exec postgres psql -U kolo_user -d kolo_db -f /docker-entrypoint-initdb.d/01-schema.sql
```

## 🌐 API Deployment

### Docker Deployment

```bash
# Build image
docker build -t kolo-api:latest apps/api/

# Run container
docker run -p 4000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/kolo_db \
  -e JWT_SECRET=your-secret-key \
  kolo-api:latest
```

### Using Docker Compose

```bash
# All services
docker-compose up

# API only
docker-compose up api
```

### Traditional Node.js Deployment

**Development:**
```bash
cd apps/api
npm run dev
```

**Production:**
```bash
cd apps/api
npm install --only=production
npm run start
```

### Using PM2 (Production)

```bash
cd apps/api

# Install PM2 globally (if not already)
npm install -g pm2

# Start with ecosystem config
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs kolo-api

# Stop
pm2 stop kolo-api

# Restart
pm2 restart kolo-api
```

## 🎨 Web Deployment

### Build for Production

```bash
cd apps/web
npm run build
```

Output: `dist/` folder

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd apps/web
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd apps/web
netlify deploy --prod --dir dist
```

### Docker Deployment

```bash
# Multi-stage build
docker build -t kolo-web:latest apps/web/
docker run -p 80:80 kolo-web:latest
```

## 📱 Mobile Deployment

### iOS (Expo)

```bash
cd apps/mobile

# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android (Expo)

```bash
cd apps/mobile

# Build for Android
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

### Development Build

```bash
cd apps/mobile

# Start dev server
npm start

# Or
expo start

# Scan QR code with Expo Go app on physical device
```

## 🔐 Environment Variables

### API (.env or .env.local)

```bash
# Server
NODE_ENV=production
PORT=4000

# Database
DATABASE_URL=postgresql://user:password@host:5432/kolo_db
USE_MOCK=false

# Security
JWT_SECRET=your-very-long-random-secret-key-here

# File Storage
UPLOAD_PROVIDER=s3
UPLOAD_PATH=s3://your-bucket-name

# Notifications
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=+1234567890

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Logging
LOG_LEVEL=info
```

### Web (.env.production)

```bash
VITE_API_BASE_URL=https://api.koloapp.com/api
VITE_APP_NAME=Kolo App
VITE_ENABLE_ANALYTICS=true
```

### Mobile (.env.local)

```bash
API_URL=https://api.koloapp.com/api
APP_NAME=Kolo App
ENABLE_NOTIFICATIONS=true
DEBUG_MODE=false
```

## 📊 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Dashboard
- `GET /api/dashboard/summary` - Get financial summary
- `GET /api/dashboard/trends` - Get transaction trends

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - List transactions
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Customers & Debts
- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers
- `POST /api/debts` - Create debt record
- `GET /api/debts` - List debts
- `POST /api/debts/:id/reminder` - Send debt reminder

### Inventory
- `POST /api/inventory` - Create inventory item
- `GET /api/inventory` - List inventory
- `PUT /api/inventory/:id/quantity` - Update quantity
- `GET /api/inventory/low-stock` - Get low stock items

### Market Pricing
- `GET /api/market/prices` - Get market prices by region
- `POST /api/market/calculate-margin` - Calculate profit margin

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U kolo_user -d kolo_db

# Check connection string format
# postgresql://username:password@host:port/database

# Verify PostgreSQL is running
# Windows: Services.msc > PostgreSQL
# macOS: brew services list
# Linux: sudo service postgresql status
```

### API Won't Start

```bash
# Check if port 4000 is in use
# Windows: netstat -ano | findstr :4000
# macOS/Linux: lsof -i :4000

# Kill process if needed
# Windows: taskkill /PID <PID> /F
# macOS/Linux: kill -9 <PID>

# Check Node modules
rm -rf node_modules apps/*/node_modules
npm install --workspace @kolo/api
```

### Environment Variable Issues

```bash
# Copy example to correct location
cd apps/api
cp .env.example .env

# Verify variables are loaded
node -e "console.log(process.env.DATABASE_URL)"

# For Windows, use .env file instead of .env.local
```

### Docker Issues

```bash
# View logs
docker-compose logs -f api

# Rebuild image
docker-compose build --no-cache api

# Remove all containers and volumes
docker-compose down -v
```

## 📈 Performance Optimization

1. **Database Indexing** - Already configured in schema.sql
2. **Connection Pooling** - Configure in DATABASE_URL
3. **Caching** - Implement Redis for session/cache storage
4. **CDN** - Serve static assets from CloudFront/CloudFlare
5. **Monitoring** - Set up Sentry for error tracking

## 🔄 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] All tests pass
- [ ] API health check passes
- [ ] Web build completes without errors
- [ ] Mobile builds successfully
- [ ] CORS configured correctly
- [ ] SSL/TLS certificates installed
- [ ] Backups configured
- [ ] Monitoring and logging set up
- [ ] Database user roles restricted
- [ ] Secrets never committed to git

## 📞 Support

For issues or questions:
1. Check `.env` configuration
2. Review logs in `logs/` directory
3. Check database connection
4. Verify all dependencies installed
5. Review Troubleshooting section above

## 📄 License

Kolo App © 2026. All rights reserved.

---

**Last Updated:** June 2, 2026
