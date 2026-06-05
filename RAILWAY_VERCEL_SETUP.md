# Railway + Vercel Deployment Guide

## 🎯 Overview

- **Railway**: Backend API + PostgreSQL database
- **Vercel**: Web frontend (React)
- **Mobile**: Can be deployed separately with Expo

---

## ✅ PREREQUISITES

Before starting, you need:

1. **GitHub Account** (free from https://github.com)
2. **Railway Account** (free from https://railway.app)
3. **Vercel Account** (free from https://vercel.com)
4. Your Kolo App code pushed to GitHub

---

## 📌 STEP 1: Push Code to GitHub

### If you haven't created a GitHub repo yet:

**On GitHub.com:**
1. Go to https://github.com/new
2. Name it: `kolo-app`
3. Choose "Public" or "Private"
4. Click "Create repository"

**In your terminal (Windows PowerShell):**

```powershell
cd "c:\Users\DELL\Desktop\KOLO APP"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Kolo App"

# Add remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/kolo-app.git

# Change branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

✅ Your code is now on GitHub!

---

## 🚂 STEP 2: Deploy Backend to Railway

### Step 2.1: Create Railway Account

1. Go to https://railway.app
2. Click "Sign Up"
3. Sign up with GitHub (recommended - easier)
4. Authorize Railway to access your GitHub

### Step 2.2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub"**
3. Search for your repo: **`kolo-app`**
4. Select it and click "Deploy"

### Step 2.3: Add PostgreSQL Database

1. In Railway dashboard, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically add it to your project

### Step 2.4: Configure API Service

1. Click on the **`kolo-app`** service
2. Click **"Variables"** tab
3. Add these environment variables:

```
NODE_ENV = production
PORT = 4000
USE_MOCK = false
JWT_SECRET = your_secure_key_here
CORS_ORIGIN = https://your-vercel-app.vercel.app
DATABASE_URL = (Railway auto-generates this, leave it)
```

**To generate a secure JWT_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2.5: Configure Build & Start Commands

1. Click **"Settings"** tab
2. Find **"Custom Domain"** - Railway will assign you a domain (note it down)
3. Find **"Build Command"** - set to:
```
npm --workspace @kolo/api install
```

4. Find **"Start Command"** - set to:
```
cd apps/api && npm start
```

### Step 2.6: Deploy

1. Click the **"Deploy"** button (top right)
2. Wait for deployment (2-5 minutes)
3. You'll see a checkmark when done

✅ Your API is now live!

**Note your API URL:** It will look like:
```
https://kolo-app-production.up.railway.app/api
```

---

## ⚡ STEP 3: Deploy Frontend to Vercel

### Step 3.1: Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize Vercel

### Step 3.2: Import Project

1. Click **"New Project"**
2. Search for **`kolo-app`** repo
3. Click **"Import"**

### Step 3.3: Configure Build Settings

1. **Framework**: Select **"Vite"**
2. **Root Directory**: Select **`apps/web`**
3. **Build Command**: 
```
npm run build
```
4. **Start Command**:
```
npm start
```

### Step 3.4: Add Environment Variables

1. Before deploying, click **"Environment Variables"**
2. Add this variable:

```
Name: VITE_API_BASE_URL
Value: https://your-railway-api-url.up.railway.app/api
```

(Use the Railway API URL from Step 2.6)

### Step 3.5: Deploy

1. Click **"Deploy"**
2. Wait for deployment (1-3 minutes)
3. You'll get a URL like: `https://kolo-app.vercel.app`

✅ Your web app is now live!

---

## 🔄 STEP 4: Update Railroad API CORS Settings

Now that you have your Vercel URL, update Railway to allow it:

1. Go to Railway dashboard
2. Click on your project
3. Click the **API service**
4. Go to **Variables** tab
5. Update `CORS_ORIGIN`:
```
CORS_ORIGIN = https://your-vercel-app.vercel.app
```

6. **Deploy** again to apply changes

---

## ✨ STEP 5: Test Your Deployed App

1. Go to your Vercel URL (e.g., https://kolo-app.vercel.app)
2. You should see the Kolo App interface
3. Try logging in or creating a transaction
4. Check if it's connecting to your Railway API

**If something doesn't work:**
- Check Railway logs: Click service → "Logs"
- Check Vercel logs: Click "Deployments" → "Logs"
- Verify environment variables are correct

---

## 📱 STEP 6: Deploy Mobile App (Optional)

### Using Expo (Simplest)

```powershell
cd "c:\Users\DELL\Desktop\KOLO APP\apps\mobile"

# Update .env.local with your API URL
# VITE_API_BASE_URL=https://your-railway-api.up.railway.app/api

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

---

## 📊 Your Deployment Architecture

```
┌─────────────────────────┐
│   Vercel (Web App)      │
│ https://kolo-app.v...   │
└────────────┬────────────┘
             │ API calls
             ▼
┌──────────────────────────────┐
│      Railway (Backend)        │
│ https://kolo-app-prod.u...   │
│                               │
│  ├─ API Server (Node.js)      │
│  └─ PostgreSQL Database       │
└──────────────────────────────┘
```

---

## 🚀 Automatic Deployments

Both Vercel and Railway auto-deploy when you push to GitHub!

```powershell
# Make changes to your code
# Commit and push
git add .
git commit -m "Your message"
git push origin main

# Vercel & Railway automatically redeploy! ✨
```

---

## 🔐 Security Checklist

Before going public:

- [ ] Generate strong JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Update CORS_ORIGIN to your domain
- [ ] Use HTTPS (both platforms do this automatically)
- [ ] Don't commit .env files (use .gitignore)
- [ ] Enable Railway private networking
- [ ] Set up database backups

---

## 💡 Troubleshooting

### "Cannot find module @kolo/api"
**Solution:** Update build commands to install workspace dependencies:
```
npm --workspace @kolo/api install && cd apps/api && npm start
```

### "API connection refused"
**Solution:** Check CORS_ORIGIN in Railway matches your Vercel URL

### "Database connection failed"
**Solution:** Railway auto-creates DATABASE_URL, but ensure it's in variables

### "Build failed on Vercel"
**Solution:** 
1. Check build logs
2. Ensure `apps/web/package.json` exists
3. Update root Directory to `apps/web`

### "Port 4000 already in use"
**Solution:** Railway handles this automatically, PORT variable works

---

## 📞 Support Links

- **Railway Help**: https://docs.railway.app
- **Vercel Help**: https://vercel.com/docs
- **GitHub Help**: https://docs.github.com

---

## ✅ Checklist

- [ ] GitHub account created
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Railway: API deployed
- [ ] Railway: PostgreSQL added
- [ ] Railway: Environment variables set
- [ ] Vercel account created
- [ ] Vercel: Web frontend deployed
- [ ] Vercel: Environment variables set
- [ ] Vercel: CORS updated in Railway
- [ ] Test deployed app
- [ ] Share your live URLs!

---

**You're ready to deploy! Follow the steps above and you'll have a live app in 15-20 minutes.** 🎉

