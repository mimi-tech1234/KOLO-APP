# Railway + Vercel Visual Setup Guide

## 🎬 Part 1: GitHub Setup (Videos Recommended)

### What You're Doing:
- Creating a GitHub repository
- Pushing your code to GitHub
- Connecting it to Railway & Vercel

### Step 1: Create GitHub Repo

**On GitHub.com:**
1. Click the **+** icon (top right)
2. Select **"New repository"**
3. Name it: **`kolo-app`**
4. Choose **"Public"** (or Private)
5. Click **"Create repository"**

**You'll see a screen with:**
```
https://github.com/YOUR_USERNAME/kolo-app
```

### Step 2: Push Code to GitHub

**In PowerShell (as Administrator):**

```powershell
# 1. Navigate to your project
cd "c:\Users\DELL\Desktop\KOLO APP"

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. Create first commit
git commit -m "Initial commit: Kolo App"

# 5. Add remote repository (change YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/kolo-app.git

# 6. Rename branch to main (if needed)
git branch -M main

# 7. Push code to GitHub
git push -u origin main
```

**After this, your code is on GitHub!** You can verify by going to GitHub.com and seeing your files.

---

## 🚂 Part 2: Railway Setup (Detailed)

### Step A: Create Railway Account

**Visit:** https://railway.app

1. Click **"Get Started"** or **"Sign Up"**
2. Choose **"Sign up with GitHub"** (easier)
3. Click **"Authorize railway-app"**
4. Read the setup prompt

### Step B: Deploy API Service

**In Railway Dashboard:**

1. Click **"+ New Project"**
2. Select **"Deploy from GitHub"**
3. Search for **`kolo-app`**
4. Click on your repo
5. Choose branch: **`main`**
6. Click **"Deploy"**

**Railway will:**
- Auto-detect your project
- Start building (this takes 1-2 minutes)
- Create a service called `kolo-app`

### Step C: Add PostgreSQL Database

**In Railway Dashboard:**

1. Click **"+ New"** button
2. Select **"Database"**
3. Select **"PostgreSQL"**
4. Railway adds it automatically!

**You'll see:**
- A new PostgreSQL service
- Connected to your API service

### Step D: Set Environment Variables

**In Railway Dashboard:**

1. Click the **`kolo-app`** service (not PostgreSQL)
2. Click **"Variables"** tab
3. Click **"Add Variable"**
4. Add these 5 variables one by one:

```
Variable 1:
Name: NODE_ENV
Value: production

Variable 2:
Name: PORT
Value: 4000

Variable 3:
Name: USE_MOCK
Value: false

Variable 4:
Name: JWT_SECRET
Value: (generate with command below)

Variable 5:
Name: CORS_ORIGIN
Value: https://your-vercel-app.vercel.app
(you'll update this after Vercel setup)
```

**To generate JWT_SECRET:**
```powershell
# Run this in PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the long string and paste it in Railway
```

### Step E: Configure Build & Start

**In Railway Dashboard:**

1. Click **"Settings"** tab
2. Look for **"Build Command"** section
3. Set Build Command to:
```
npm --workspace @kolo/api install
```

4. Look for **"Start Command"** section
5. Set Start Command to:
```
cd apps/api && npm start
```

6. Look for **"Custom Domain"** (optional but good to have)
   - Toggle it ON
   - Railway will generate: `your-app-production.up.railway.app`
   - **Note this URL! You'll need it for Vercel.**

### Step F: Deploy

**In Railway Dashboard:**

1. Click **"Deploy"** button (top right area)
2. Wait for green checkmark (2-5 minutes)
3. You should see:
   - ✅ Build successful
   - ✅ Service running
   - Your custom domain URL

**Save your Railway API URL:**
```
https://your-app-production.up.railway.app/api
```

---

## ⚡ Part 3: Vercel Setup (Detailed)

### Step A: Create Vercel Account

**Visit:** https://vercel.com

1. Click **"Sign Up"**
2. Choose **"Continue with GitHub"**
3. Click **"Authorize Vercel"**
4. Read the setup info

### Step B: Import Project

**In Vercel Dashboard:**

1. Click **"Add New"** → **"Project"**
2. Search for **`kolo-app`**
3. Click **"Import"**

### Step C: Configure Project

**In Vercel Setup Screen:**

1. **Framework Preset:** 
   - Select **"Vite"**

2. **Root Directory:**
   - Click the dropdown
   - Select **"apps/web"**

3. **Build Command:**
   - Should auto-fill as: `npm run build`
   - If not, set it to that

4. **Output Directory:**
   - Should be: `dist`

### Step D: Add Environment Variables

**Before clicking Deploy:**

1. Click **"Environment Variables"**
2. Add this variable:

```
Name: VITE_API_BASE_URL
Value: https://your-railway-url.up.railway.app/api
```

(Paste the Railway URL from Step F above)

3. Select all environments: **Production, Preview, Development**

### Step E: Deploy

**In Vercel:**

1. Click **"Deploy"** button
2. Wait for deployment (1-3 minutes)
3. You'll see "Congratulations! Your project has been successfully deployed"
4. Click on the preview link

**Your Vercel URL:**
```
https://your-project-name.vercel.app
```

**Note this URL! You need it for Railway CORS.**

---

## 🔄 Part 4: Connect Everything

### Update Railway CORS

**In Railway Dashboard:**

1. Go to your **`kolo-app`** service
2. Click **"Variables"** tab
3. Find **`CORS_ORIGIN`** variable
4. Update it to your Vercel URL:

```
https://your-project-name.vercel.app
```

5. Click **"Deploy"** button
6. Wait for green checkmark

### Test Connection

1. Go to your Vercel URL
2. You should see the Kolo App interface
3. Click "Dashboard" button
4. If you see data, it's working! ✨

---

## 🖼️ What You Should See

### Railway Dashboard
```
┌─────────────────────────────────┐
│ Your Project                     │
├─────────────────────────────────┤
│ ✅ kolo-app (API)                │
│    Status: Running              │
│    URL: kolo-app-prod.u...      │
│                                 │
│ ✅ PostgreSQL (Database)         │
│    Status: Running              │
└─────────────────────────────────┘
```

### Vercel Dashboard
```
┌─────────────────────────────────┐
│ kolo-app                        │
├─────────────────────────────────┤
│ Production: ✅ Ready            │
│ URL: kolo-app.vercel.app        │
│                                 │
│ Latest Deployment:              │
│ @your-github-account            │
│ Completed in 45s                │
└─────────────────────────────────┘
```

---

## 🐛 Debugging

### If Railway shows red ❌

1. Click the service
2. Go to "Logs" tab
3. Look for error messages
4. Common issues:
   - `Cannot find module` → Check build commands
   - `Database error` → Check DATABASE_URL variable
   - `Port already in use` → Change PORT variable

### If Vercel shows red ❌

1. Click "Deployments"
2. Click the failed deployment
3. Click "Logs"
4. Look for build errors
5. Common issues:
   - `Module not found` → Run `npm install` locally first
   - `Missing .env` → Add VITE_API_BASE_URL to variables
   - `Build timed out` → Check package.json scripts

### If App Loads But No Data

1. Open browser console (F12)
2. Look for errors
3. Check:
   - CORS errors → Update CORS_ORIGIN in Railway
   - 404 errors → Check API URL in Vercel variables
   - Network errors → Verify Railway is running

---

## ✅ How to Know It's Working

**On your Vercel URL, you should be able to:**

- [ ] See the Kolo App header and navigation buttons
- [ ] Click "Dashboard" and see financial data
- [ ] Click "Money" and see transaction history
- [ ] Click "Customers" and see customer list
- [ ] Click "Inventory" and see stock items
- [ ] See no console errors (F12)

---

## 📞 Live Support Links

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Docs:** https://docs.github.com

---

## 🎉 Congratulations!

If you've completed all steps:
- ✅ GitHub repo is live
- ✅ Railway API is deployed
- ✅ Vercel frontend is deployed
- ✅ Everything is connected
- ✅ Your Kolo App is on the internet!

**Your live URLs:**
```
Frontend: https://your-app.vercel.app
API:      https://your-app-prod.up.railway.app/api
```

---

## 🚀 Next Steps

1. **Share your app!** Send the Vercel URL to friends
2. **Enable auto-deployments** - Just push to GitHub!
3. **Monitor your app** - Check Railway & Vercel logs
4. **Add custom domain** - Both support custom domains
5. **Deploy mobile app** - When you're ready

---

**Need more help? Check the detailed RAILWAY_VERCEL_SETUP.md file**
