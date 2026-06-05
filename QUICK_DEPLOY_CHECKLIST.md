# Railway + Vercel Setup - Quick Checklist

## 📋 Step-by-Step (Do these in order)

### ✅ PART 1: GitHub Setup (10 minutes)

- [ ] Go to https://github.com/new
- [ ] Create repo named `kolo-app`
- [ ] Copy the HTTPS URL from GitHub
- [ ] Open PowerShell in your project folder
- [ ] Run these commands:

```powershell
cd "c:\Users\DELL\Desktop\KOLO APP"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/kolo-app.git
git branch -M main
git push -u origin main
```

**✅ You're done when:** You can see your files on GitHub.com

---

### ✅ PART 2: Railway Setup (10 minutes)

#### 2.1 Create Account & Project
- [ ] Go to https://railway.app
- [ ] Click "Sign Up" → Choose "GitHub"
- [ ] Authorize Railway
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub"
- [ ] Search & select `kolo-app`
- [ ] Click "Deploy"

#### 2.2 Add Database
- [ ] Click "+ New" in Railway dashboard
- [ ] Select "Database" → "PostgreSQL"
- [ ] Wait for it to be created (2 min)

#### 2.3 Set Environment Variables
- [ ] Click on your API service
- [ ] Go to "Variables" tab
- [ ] Add these 5 variables:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `USE_MOCK` | `false` |
| `JWT_SECRET` | `(run command below)` |
| `CORS_ORIGIN` | `https://your-vercel-domain.vercel.app` |

**To generate JWT_SECRET, run in PowerShell:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2.4 Set Build Commands
- [ ] Click "Settings" tab
- [ ] Find "Build Command" → set to:
```
npm --workspace @kolo/api install
```
- [ ] Find "Start Command" → set to:
```
cd apps/api && npm start
```

#### 2.5 Deploy
- [ ] Click the "Deploy" button
- [ ] Wait for green checkmark (2-5 min)
- [ ] Copy your API URL (looks like: `https://kolo-app-production.up.railway.app`)
- [ ] **Save this URL!** You'll need it for Vercel

**✅ You're done when:** You see green checkmark and a live API URL

---

### ✅ PART 3: Vercel Setup (10 minutes)

#### 3.1 Create Account & Project
- [ ] Go to https://vercel.com
- [ ] Click "Sign Up" → Choose "GitHub"
- [ ] Authorize Vercel
- [ ] Click "New Project"
- [ ] Search & select `kolo-app`
- [ ] Click "Import"

#### 3.2 Configure Build Settings
- [ ] Framework: Select **"Vite"**
- [ ] Root Directory: Select **"apps/web"**
- [ ] Build Command: `npm run build`
- [ ] Install Command: `npm install`

#### 3.3 Add Environment Variables
- [ ] Click "Environment Variables"
- [ ] Add this variable:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://your-railway-url/api` |

(Paste your Railway API URL from Part 2.5)

#### 3.4 Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment (1-3 min)
- [ ] You'll get a URL like: `https://kolo-app.vercel.app`
- [ ] **Save this URL!** You need it for Railway

**✅ You're done when:** You see "Congratulations! Your project has been successfully deployed"

---

### ✅ PART 4: Connect Them (5 minutes)

#### 4.1 Update Railway CORS
- [ ] Go back to Railway dashboard
- [ ] Click your API service
- [ ] Go to "Variables" tab
- [ ] Update `CORS_ORIGIN` to your Vercel URL:

```
https://your-vercel-app.vercel.app
```

#### 4.2 Redeploy Railway
- [ ] Click "Deploy" button
- [ ] Wait for green checkmark

**✅ You're done when:** Railway is redeployed

---

### ✅ PART 5: Test It! (5 minutes)

- [ ] Go to your Vercel URL (https://kolo-app.vercel.app)
- [ ] You should see the Kolo App interface
- [ ] Try clicking "Dashboard" button
- [ ] If data shows, it's working! ✨

---

## 🔗 Your Live URLs

After deployment, you'll have:

```
Frontend: https://kolo-app.vercel.app
API:      https://kolo-app-production.up.railway.app/api
```

---

## 🆘 If Something Goes Wrong

### Check Railway Logs
1. Go to Railway dashboard
2. Click API service
3. Click "Logs" tab
4. Look for errors

### Check Vercel Logs
1. Go to Vercel dashboard
2. Click "Deployments"
3. Click the failed deployment
4. Click "Logs" → "Build Logs"

### Common Issues

**"Build failed"**
- Check that `apps/web` folder exists
- Verify `apps/web/package.json` has correct scripts

**"API not connecting"**
- Verify `VITE_API_BASE_URL` is correct in Vercel
- Verify `CORS_ORIGIN` is correct in Railway
- Check Railway logs for errors

**"Database connection error"**
- Railway auto-creates `DATABASE_URL`
- It should already be in variables
- If not, Railway will show error in logs

---

## 🎉 Success Checklist

After completion, verify:

- [ ] Vercel shows "Production" with green checkmark
- [ ] Railway shows green checkmark for API
- [ ] Your web app loads at Vercel URL
- [ ] You can see data on dashboard
- [ ] No console errors (F12 to check)

---

## 🚀 Next: Auto-Deploy from GitHub

Once everything works:

```powershell
# Make code changes
git add .
git commit -m "Your changes"
git push origin main

# Both Vercel & Railway automatically redeploy! ✨
```

---

## 📱 Optional: Deploy Mobile App

When you're ready, follow the Mobile Deployment guide to:
- Build iOS app
- Build Android app
- Submit to App Store & Google Play

---

**Total time: ~45 minutes to go from zero to live deployment! 🎊**

**Questions? Check RAILWAY_VERCEL_SETUP.md for detailed steps.**
