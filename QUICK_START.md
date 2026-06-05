# 🚀 Kolo App - Quick Start Guide

**Your Kolo App is now ready for deployment!** 🎉

This guide will help you get started in 5 minutes.

---

## ⚡ 5-Minute Setup

### Step 1: Install Node.js (if not already installed)
- Download from [nodejs.org](https://nodejs.org/) - Choose LTS version (18+)
- Verify installation: `node --version` and `npm --version`

### Step 2: Run Setup Script

**Windows PowerShell:**
```powershell
.\setup.bat
```

**macOS/Linux Terminal:**
```bash
bash setup.sh
```

This will install all dependencies for the entire project.

### Step 3: Configure Environment

**API Configuration:**
```bash
cd apps/api
# On Windows:
copy .env.example .env
# On macOS/Linux:
cp .env.example .env

# Edit .env with your settings
```

### Step 4: Setup Database

**Windows:**
```bash
setup-db.bat
```

**macOS/Linux:**
```bash
bash setup-db.sh
```

### Step 5: Start the Application

**Open 3 separate terminals:**

**Terminal 1 - Start API Server (port 4000):**
```bash
npm run dev:api
```

**Terminal 2 - Start Web App (port 5173):**
```bash
npm run dev:web
```

**Terminal 3 - Start Mobile Dev Server:**
```bash
npm run dev:mobile
```

---

## 📋 What's Installed

### ✅ Backend API (Node.js + Express)
- 37 fully functional API endpoints
- 5 complete data models
- 3 service modules
- JWT authentication
- Database integration
- Error handling

### ✅ Frontend Web (React + Vite)
- Modern React setup
- Tailwind CSS styling
- React Router navigation
- Type-safe with TypeScript
- Ready to deploy

### ✅ Mobile App (React Native + Expo)
- Expo-based development
- NativeWind styling
- Offline-first architecture
- Push notifications
- Biometric support

### ✅ Database (PostgreSQL)
- Complete schema
- Seed data
- Indexes for performance
- Foreign key relationships

### ✅ DevOps
- Docker configuration
- Docker Compose setup
- PM2 process manager config
- Git configuration

---

## 🌐 Access Points

Once running, access:
- **API Health Check:** http://localhost:4000/health
- **API Documentation:** See DEPLOYMENT.md
- **Web App:** http://localhost:5173
- **Mobile Dev:** http://localhost:8081 or scan QR code

---

## 📂 Project Structure

```
├── apps/
│   ├── api/          ← Backend (Node.js)
│   ├── web/          ← Frontend (React)
│   └── mobile/       ← Mobile (React Native)
├── packages/db/      ← Database schema
├── docker-compose.yml
├── DEPLOYMENT.md     ← Full deployment guide
├── README.md         ← Detailed documentation
└── INSTALLATION_COMPLETE.md ← This is what you just saw
```

---

## 🔥 Common Commands

```bash
# Install dependencies
npm install

# Start API
npm run dev:api

# Start Web
npm run dev:web

# Start Mobile
npm run dev:mobile

# Build for production
npm --workspace @kolo/web run build

# Using Docker
docker-compose up

# API with PM2
pm2 start apps/api/ecosystem.config.js
```

---

## 🆘 Troubleshooting

### "Command not found"
- Make sure Node.js is installed: `node --version`
- Restart your terminal after installing Node.js

### "Database connection error"
- Ensure PostgreSQL is running
- Check `.env` file has correct DATABASE_URL
- Run database setup: `setup-db.bat` (Windows) or `bash setup-db.sh` (macOS/Linux)

### "Port already in use"
```bash
# Find what's using the port
# Windows: netstat -ano | findstr :4000
# macOS/Linux: lsof -i :4000

# Kill the process (replace with actual PID)
# Windows: taskkill /PID <PID> /F
# macOS/Linux: kill -9 <PID>
```

### npm install fails
```bash
# Clear cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

For detailed information, see:
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide (30+ pages)
- **[README.md](README.md)** - Project overview & features
- **[INSTALLATION_COMPLETE.md](INSTALLATION_COMPLETE.md)** - Full installation details
- **[PROJECT_PRD.md](PROJECT_PRD.md)** - Product requirements

---

## 🚀 Next Steps

### For Development:
1. Start all three servers (API, Web, Mobile)
2. Make changes to code
3. See hot-reload in action
4. Test across devices

### For Deployment:
1. Review [DEPLOYMENT.md](DEPLOYMENT.md)
2. Configure production environment variables
3. Deploy to your hosting platform
4. Set up monitoring & backups

### For Mobile:
1. Download Expo Go app on your phone
2. Scan QR code from `npm run dev:mobile`
3. Test on real device
4. Build and submit to stores

---

## ✨ Features Ready to Use

- ✅ User authentication
- ✅ Financial tracking
- ✅ Customer management
- ✅ Debt tracking
- ✅ Inventory management
- ✅ Market pricing
- ✅ Profit margin calculator
- ✅ Dashboard with charts
- ✅ Push notifications
- ✅ Offline support

---

## 🎯 Deployment Checklist

- [ ] Install Node.js
- [ ] Run setup script
- [ ] Configure .env files
- [ ] Setup database
- [ ] Start all servers
- [ ] Test API endpoints
- [ ] Test web app
- [ ] Test mobile app
- [ ] Review DEPLOYMENT.md
- [ ] Deploy to production

---

## 💡 Tips

1. **Keep terminals organized** - Use separate terminal windows or a terminal multiplexer (tmux, etc.)
2. **Monitor logs** - Watch terminal output for errors
3. **Save API responses** - Use Postman or similar to test endpoints
4. **Test on devices** - Use actual mobile devices for testing, not just simulators
5. **Read documentation** - DEPLOYMENT.md has everything you need

---

## 🎓 Learning Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [React Native/Expo Docs](https://docs.expo.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ❓ FAQ

**Q: Can I run just the API?**
A: Yes! `npm run dev:api` runs only the backend.

**Q: Do I need PostgreSQL installed?**
A: For development: Yes (or use Docker). For testing: The API has a mock mode.

**Q: How do I deploy to production?**
A: See DEPLOYMENT.md for detailed instructions on Docker, Heroku, AWS, etc.

**Q: Is the mobile app ready?**
A: Yes! Use Expo Go for development or build native apps with `eas build`.

**Q: Can I modify the API endpoints?**
A: Absolutely! All code is open and modular. Just follow the existing patterns.

---

## 🎉 You're All Set!

Your Kolo App is fully installed and ready to go. 

**Start developing:**
```bash
npm run dev:api    # Terminal 1
npm run dev:web    # Terminal 2
npm run dev:mobile # Terminal 3
```

**Happy coding!** 🚀

---

**Last Updated:** June 2, 2026

For more help, see **DEPLOYMENT.md** or visit the documentation links above.
