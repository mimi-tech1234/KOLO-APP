# Kolo App - Deployment Steps (Complete Guide)

## 🎯 Quick Overview

The Kolo App has three parts that can be deployed separately:
1. **Backend API** (Node.js + Express)
2. **Web Frontend** (React + Vite)
3. **Mobile App** (React Native + Expo)

---

## ✅ PHASE 1: Local Setup (Before Deployment)

### Step 1.1: Install Node.js & PostgreSQL

**Windows:**
1. Download Node.js LTS from https://nodejs.org/
2. Download PostgreSQL 14+ from https://www.postgresql.org/download/windows/
3. Verify installation:
   ```powershell
   node --version
   npm --version
   psql --version
   ```

**macOS:**
```bash
brew install node
brew install postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib
```

---

### Step 1.2: Install Project Dependencies

Navigate to your project folder:
```bash
cd "c:\Users\DELL\Desktop\KOLO APP"
```

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
bash setup.sh
```

This installs all dependencies for API, Web, and Mobile.

---

### Step 1.3: Set Up Database

**Windows:**
```bash
setup-db.bat
```

**macOS/Linux:**
```bash
bash setup-db.sh
```

This will:
- Create PostgreSQL database named `kolo_app`
- Run schema migrations
- Seed initial data

---

### Step 1.4: Configure Environment Variables

#### For Backend API:
```bash
cd apps/api
cp .env.example .env
```

Edit `.env` file with these critical values:
```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/kolo_app
JWT_SECRET=your_secure_random_key_here
USE_MOCK=false

# Server
NODE_ENV=development
PORT=4000

# CORS (for development)
CORS_ORIGIN=http://localhost:5173,http://localhost:8081

# Optional: Add-ons
SENDGRID_API_KEY=your_sendgrid_key
WHATSAPP_API_KEY=your_whatsapp_key
```

#### For Web Frontend:
```bash
cd apps/web
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_API_BASE_URL=http://localhost:4000/api
```

#### For Mobile:
```bash
cd apps/mobile
cp .env.example .env.local
```

Edit `.env.local`:
```
API_URL=http://YOUR_MACHINE_IP:4000/api
ENABLE_NOTIFICATIONS=true
```

---

## 🚀 PHASE 2: Local Testing (Verify Everything Works)

### Step 2.1: Start Backend API

**Terminal 1:**
```bash
cd apps/api
npm run dev
```

✅ Should see: `✨ Server running on port 4000`

### Step 2.2: Start Web Frontend

**Terminal 2:**
```bash
cd apps/web
npm run dev
```

✅ Should see: `Local: http://localhost:5173`

### Step 2.3: Start Mobile App (Optional)

**Terminal 3:**
```bash
cd apps/mobile
npm start
```

✅ Should see: Expo QR code in terminal

---

## 🌐 PHASE 3: Production Deployment

Choose ONE of the deployment options below:

---

## 📦 Option A: Docker Deployment (Recommended)

### Prerequisites
- Install Docker from https://www.docker.com/products/docker-desktop
- Install Docker Compose

### Step A.1: Build and Run with Docker Compose

```bash
# In project root
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- API Server (port 4000)

### Step A.2: Build Web Frontend

```bash
cd apps/web
npm run build
```

Output is in `dist/` folder. Deploy to:
- **Vercel** (recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **Any static hosting**

### Step A.3: Deploy API Container to Cloud

**Option 1: Heroku**
```bash
cd apps/api
# Install Heroku CLI
heroku create your-app-name
git push heroku main
heroku config:set DATABASE_URL=your_postgresql_url
heroku config:set JWT_SECRET=your_secret
```

**Option 2: Railway.app** (Recommended - easier)
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Connect repo and select `apps/api`
4. Add PostgreSQL add-on
5. Set environment variables in dashboard
6. Deploy

**Option 3: AWS EC2**
1. Launch EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install Docker
4. Clone repo and run `docker-compose up -d`

---

## 💻 Option B: Traditional VPS Deployment

### Step B.1: Set Up VPS Server

**Ubuntu 22.04 Server:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step B.2: Clone Repository

```bash
git clone https://github.com/your-repo/kolo-app.git
cd kolo-app
npm install
npm --workspace @kolo/api install
npm --workspace @kolo/web install
```

### Step B.3: Set Up PostgreSQL

```bash
sudo -u postgres psql
postgres=# CREATE DATABASE kolo_app;
postgres=# CREATE USER kolo_user WITH PASSWORD 'strong_password';
postgres=# ALTER ROLE kolo_user SET client_encoding TO 'utf8';
postgres=# ALTER ROLE kolo_user SET default_transaction_isolation TO 'read committed';
postgres=# GRANT ALL PRIVILEGES ON DATABASE kolo_app TO kolo_user;
postgres=# \q
```

Run migrations:
```bash
cd apps/api
psql -U kolo_user -d kolo_app -f ../../packages/db/schema.sql
psql -U kolo_user -d kolo_app -f ../../packages/db/seed.sql
```

### Step B.4: Configure Environment

```bash
cd apps/api
nano .env
```

Add:
```
DATABASE_URL=postgresql://kolo_user:strong_password@localhost:5432/kolo_app
JWT_SECRET=your_secure_random_key
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://yourdomain.com
```

### Step B.5: Start API with PM2

```bash
cd apps/api
pm2 start src/server.js --name "kolo-api" --instances max
pm2 save
pm2 startup
```

### Step B.6: Build & Deploy Web Frontend

```bash
cd apps/web
npm run build
# Copy dist/ to web server (Nginx/Apache)
sudo cp -r dist/* /var/www/html/
```

### Step B.7: Set Up Nginx Reverse Proxy

```bash
sudo apt install -y nginx
```

Create `/etc/nginx/sites-available/kolo`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Web frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/kolo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step B.8: Set Up SSL Certificate (Free with Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 📱 Option C: Mobile App Deployment

### For iOS:
1. Create Apple Developer account
2. Use Expo:
   ```bash
   cd apps/mobile
   eas build --platform ios
   eas submit --platform ios
   ```

### For Android:
1. Create Google Play Developer account
2. Use Expo:
   ```bash
   cd apps/mobile
   eas build --platform android
   eas submit --platform android
   ```

---

## 🔒 Security Checklist Before Production

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly (not `*`)
- [ ] Set up firewall rules
- [ ] Enable database backups
- [ ] Add rate limiting
- [ ] Set up monitoring/logging
- [ ] Review environment variables
- [ ] Test API with invalid inputs

---

## 📊 Recommended Deployment Architecture

### For Small Business (Starting):
```
┌─────────────────┐
│  Vercel (Web)   │ ← React frontend
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Railway   │ ← Node.js API + PostgreSQL
    └──────────┘
```

### For Growing Business:
```
┌──────────────────┐     ┌──────────────┐
│ Vercel (Web)     │     │ Expo (Mobile)│
└────────┬─────────┘     └──────────────┘
         │
    ┌────▼─────────┐
    │ AWS:          │
    │ - EC2 (API)   │
    │ - RDS (DB)    │
    │ - S3 (Files)  │
    └───────────────┘
```

---

## 🛠️ Monitoring & Maintenance

### Check API Health
```bash
curl http://localhost:4000/health
```

### View Logs
```bash
pm2 logs kolo-api
```

### Restart Services
```bash
pm2 restart kolo-api
docker-compose restart
```

### Database Backup
```bash
pg_dump -U kolo_user kolo_app > backup.sql
```

---

## 🆘 Common Issues & Solutions

### Error: "Cannot find module"
```bash
npm install
npm --workspace @kolo/api install
```

### Error: "Port 4000 already in use"
```bash
# Kill process using port 4000
lsof -ti:4000 | xargs kill -9
```

### Database connection failed
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check username/password

### CORS errors
- Update CORS_ORIGIN in .env
- Should match your frontend domain

---

## 📞 Getting Help

Refer to:
- Full Documentation: [DEPLOYMENT.md](DEPLOYMENT.md)
- Quick Start: [QUICK_START.md](QUICK_START.md)
- Installation: [INSTALLATION_COMPLETE.md](INSTALLATION_COMPLETE.md)

---

## ✨ Next Steps

1. **Complete Phase 1** (Local Setup)
2. **Complete Phase 2** (Local Testing)
3. **Choose deployment option** (A, B, or C)
4. **Deploy to production**
5. **Set up monitoring**
6. **Go live!** 🚀

---

**Questions? Check the full [DEPLOYMENT.md](DEPLOYMENT.md) for detailed info on each section.**
