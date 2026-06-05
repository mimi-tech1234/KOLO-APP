# Kolo App - Project PRD

## Kolo App — Full-Stack Prompting Architecture
### Built on the 5 Core Pillars of Prompting

---

## The 5 Pillars

| Pillar | Purpose |
|---|---|
| **1. ROLE** | Who Claude is |
| **2. CONTEXT** | The situation & constraints |
| **3. TASK** | What to build exactly |
| **4. FORMAT** | How to structure the output |
| **5. GUARDRAILS** | What to avoid |

---

## The Full Prompt

### [ROLE]
You are a senior full-stack engineer and UI/UX designer specializing in premium, consumer-grade mobile applications. You have deep expertise in building React Native (Expo) frontends, Node.js/Express backends, and PostgreSQL databases. You are known for crafting rich, polished interfaces with exceptional attention to typography, motion, and visual hierarchy — and you understand fintech UX, data security, and African market business patterns.

### [CONTEXT]
I am building **Kolo App** — a smart bookkeeping and financial management app for African artisans and small business owners (tailors, cobblers, welders, food vendors, hair braiders). Users are everyday entrepreneurs who need a clean, reliable way to track their money, manage customers, and protect themselves from being overcharged. The app should feel modern, premium, and trustworthy — comparable to top-tier fintech apps globally, with a cultural identity rooted in Africa. Target region: West Africa (Nigeria/Ghana). Currency: NGN/GHS. The app should feel like a powerful business tool they are proud to use.

### [TASK]
Build a complete full-stack application with the following modules:

#### Frontend (React Native + Expo)
- **Onboarding:** Elegant welcome screens, email/phone + password auth, business type selector, profile setup with avatar upload
- **Dashboard:** Rich financial overview with animated charts, income/expense cards, profit trend graphs, quick-action FAB button
- **Money Tracker:** Transaction entry with category picker, receipt photo attachment, daily/weekly/monthly chart views with smooth transitions
- **Customer Debt Book:** Customer profiles with photo, debt tracking, one-tap WhatsApp reminder (deep link), overdue debt badges
- **Inventory Screen:** Product cards with photos, quantity management, low-stock alerts, stock value summary
- **Anti-Scam Insight Screen:** Market price checker, profit margin calculator with visual breakdown, transaction anomaly alerts
- **Trust & Share Screen:** Biometric/PIN lock (Expo LocalAuthentication), exportable PDF/image summary reports, trusted contact sharing

#### Backend (Node.js + Express + PostgreSQL)
- REST API with JWT auth (email/phone + password, biometric token refresh)
- Tables: `users`, `transactions`, `customers`, `debts`, `inventory_items`, `price_benchmarks`
- Endpoints: CRUD for all modules, market price benchmark seeding, summary report generation
- Offline sync queue: local SQLite on device, sync to Postgres when online
- WhatsApp reminder via Twilio WhatsApp API or `wa.me` deep link fallback

#### Additional
- Expo Speech API integration for optional voice input
- PDF report generation (react-native-html-to-pdf)
- Database schema with seed data for Nigerian/Ghanaian market price benchmarks
- Push notifications for debt reminders and low stock alerts

### [FORMAT]
Deliver the project in this order:
1. Folder structure (full monorepo layout)
2. Database schema (SQL)
3. Backend code (server.js, routes, controllers, models)
4. Frontend screens (one at a time, fully styled)
5. README with setup instructions

Use clear file path comments at the top of every code block. Use functional React components with hooks. Style with NativeWind (Tailwind for React Native). Prioritize rich UI — smooth animations, beautiful typography, premium card layouts. Add inline comments explaining every major decision for a junior developer to understand.

### [GUARDRAILS]
- Do NOT build a generic, cookie-cutter UI — every screen must feel intentionally designed
- Do NOT skip animations and transitions — motion is part of the premium feel
- Do NOT assume internet connectivity — build offline-first with sync
- Do NOT skip error handling — every API call must have a loading, success, and error state
- Do NOT use flat, lifeless color palettes — use rich, layered tones with depth and contrast
- Avoid purple gradient "AI app" aesthetics — use a bold, culturally-rooted African design language (deep indigo, warm gold, earthy terracotta, forest green)

---

## Feature Checklist

### Money Tracking
- [ ] Voice input or picture-tapping to record sales/expenses
- [ ] Visual summaries with big numbers and color-coded charts
- [ ] Daily/weekly/monthly totals shown as coin-stack icons

### Debt & Credit Ledger
- [ ] Customer photo + debt amount tracking
- [ ] One-tap WhatsApp reminder to debtors
- [ ] Overdue debt alerts

### Inventory / Stock
- [ ] Photo-based product/stock tracking
- [ ] Low stock alerts with push notifications

### Anti-Scam Insights
- [ ] Market price checker
- [ ] Profit margin visual calculator
- [ ] Unusual transaction flagging

### Social / Trust Layer
- [ ] Share summary report with trusted family member
- [ ] PIN + fingerprint lock

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#1B1F5E` (Deep Indigo) | Headers, nav, primary actions |
| Accent | `#D4A017` (Gold) | Highlights, profit indicators, badges |
| Success | `#2E7D32` (Forest Green) | Positive balances, income |
| Danger | `#C62828` (Deep Red) | Debts, losses, alerts |
| Warm | `#C1440E` (Terracotta) | Secondary CTAs, cultural warmth |
| Background | `#F8F9FF` (Soft White) | App background |
| Surface | `#FFFFFF` (White) | Cards, modals |
| Text Primary | `#0D0F1C` (Near Black) | Body text |

---

*Kolo App — Your business, beautifully in control.*
