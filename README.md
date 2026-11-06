# 🚀 GroupFund AI — Unified Financial Collaboration Platform

> **Manage Money Together. Fund Innovation Together.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![PayPal Sandbox](https://img.shields.io/badge/PayPal-Sandbox%20Orders%20v2-0070ba.svg)](https://developer.paypal.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-8b5cf6.svg)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20RLS-3ecf8e.svg)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🔗 Quick Links
- **Live Demo:** [https://groupfund-ai.onrender.com/](https://groupfund-ai.onrender.com/)
- **Demo Video (YouTube):** [https://youtu.be/your-demo-video-id](https://youtu.be/your-demo-video-id) *(Paste your YouTube link here)*
- **Interactive Pitch Deck:** Available in-app at [`/slides`](http://localhost:3000/slides)
- **Render Deployment Guide:** See [`RENDER_DEPLOYMENT.md`](RENDER_DEPLOYMENT.md)
- **Devpost Submission Guide:** See [`DEVPOST_SUBMISSION.md`](DEVPOST_SUBMISSION.md)

---

## 🌟 Project Overview

**GroupFund AI** is a modern, responsive, full-stack financial platform built for the **PayPal AI Hackathon**. It bridges two major student and campus financial challenges onto one unified operating system:

1. **Group Expenses (Module A):** Social expense management for college trips, shared flats, hackathons, and clubs with **exact integer paise math**, **Gemini multimodal receipt scanning**, and a mathematically optimal **Min-Cash-Flow debt simplification algorithm**.
2. **Student Innovation Crowdfunding (Module B):** A crowdfunding platform for student hardware, robotics, and AI prototypes with **Gemini AI grant proposal drafting**, **milestone evidence verification**, and **PayPal Developer Sandbox checkout** with server-side order capture.

---

## 💳 PayPal Integration (Orders v2 API)

GroupFund AI uses the official **PayPal REST Orders v2 API** with complete server-side verification:

- **Server-Side Order Creation (`/api/paypal/create-order`):** The server interacts with `POST /v2/checkout/orders` using OAuth2 client credentials, specifying `intent: "CAPTURE"`, return/cancel URLs, and tracking parameters.
- **Server-Side Cryptographic Capture (`/api/paypal/capture-order`):** When the buyer approves the payment on `sandbox.paypal.com`, the return handler passes the token to our server endpoint, which calls `POST /v2/checkout/orders/{id}/capture`. The client cannot manipulate payment states or balances.
- **Idempotency & Replay Protection:** Rejects duplicate captures for the same order ID with `HTTP 409 Conflict`.
- **Cross-Border USD/INR Dual-Currency Bridge:** PayPal does not support domestic INR-to-INR merchant payments in India. To enable international sandbox backers and diaspora alumni to fund student prototypes, the platform charges in USD at a fixed demo exchange rate (**₹83 = $1 USD**), while passing the exact INR paise amount in `purchase_units[0].custom_id`. Upon capture, the recipient project's internal ledger increments strictly in integer INR paise without precision loss.

---

## 🤖 Google Gemini AI Integration

Powered by **Google Gemini 2.5 Flash** with low latency and multimodal vision capabilities:

1. **Multimodal Receipt OCR (`/api/ai/scan-receipt`):** Accepts raw JPG/PNG receipt photos, extracts merchant name, date, itemized line items, tax, and totals, and auto-populates split forms.
2. **AI Grant Proposal Writer (`/api/ai/project-assistant`):** Transforms a 2-sentence student robotics concept into a complete 5-part grant proposal with bill of materials (BOM) and milestone timelines.
3. **Milestone Progress Auditing (`/api/ai/analyze-milestone`):** Evaluates laboratory progress photos, sensor logs, and GitHub deliverables against milestone criteria to provide transparent verification scores (0–100) before funding tranches unlock.

> [!NOTE]
> **Graceful Fallbacks:** If `GEMINI_API_KEY` is omitted or encounters rate limits, smart built-in fallback simulators automatically return realistic structured JSON so the application remains 100% functional during live evaluation.

---

## 🛠️ Tech Stack & Sponsor Integrations

| Layer | Technologies & Sponsor Tools |
|---|---|
| **Frontend Framework** | **Next.js 16** (Turbopack, Server Actions, Partial Prerendering) + **React 19** |
| **Language** | **TypeScript 5.0** (Strict Mode, 100% type-safe) |
| **Styling** | **Tailwind CSS v4**, Glassmorphism UI, Lucide Icons, Canvas Confetti |
| **Payment Sponsor** | **PayPal REST Orders v2 API** (Sandbox Merchant & Orders verification) |
| **AI Sponsor** | **Google Gemini 2.5 Flash API** (Multimodal Vision OCR & Structured JSON generation) |
| **Database & Sync** | **Supabase** (PostgreSQL schema with Row-Level Security) + Reactive LocalStore |
| **Validation** | **Zod v4** schema validation |
| **Automation & E2E** | **Playwright Chromium** end-to-end testing and video recording |

---

## 🚀 Key Features

- **Exact Integer Paise Math:** Every financial balance is stored as integer paise (`1 INR = 100 paise`), eliminating IEEE-754 floating-point rounding errors entirely.
- **Min-Cash-Flow Debt Settlement Engine:** Graph-theoretic reduction algorithm reduces complex $N$-person web debts down to the minimal $N-1$ bilateral transfers.
  - *Example:* 5 friends spend ₹10,000 (Daksh ₹5k, Rahul ₹2k, Jay ₹1.5k, Meet ₹1k, Harsh ₹500). Algorithm resolves all balances with just 3 transfers.
- **3-Way Split Methods:** Equal splits with exact remainder distribution, percentage splits with 100% validation, and custom split allocations.
- **Milestone-Gated Crowdfunding:** Back student engineering prototypes (e.g. *Autonomous AgriBot*). Funds are allocated by verifiable milestone tranches with photo & code review.
- **Browser-Based Pitch Deck (`/slides`):** Full-screen 8-slide presentation deck directly inside the application for seamless judge demonstrations.
- **Interactive First-Time Walkthrough:** 5-step guided Joyride tour spotlighting key platform workflows.

---

## ⚡ Running Locally

### 1. Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm 9+

### 2. Clone & Install
```bash
git clone https://github.com/Daksh159357/groupfund-ai.git
cd groupfund-ai
npm install
```

### 3. Environment Configuration
Copy the template file to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials in `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_CURRENCY=INR

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# PayPal Developer Sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-us-merchant-client-id
PAYPAL_CLIENT_SECRET=your-us-merchant-secret
PAYPAL_ENVIRONMENT=sandbox

# Supabase (Optional — Local persistent storage is active by default)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 💳 PayPal Sandbox Setup (Important)

> [!IMPORTANT]
> **US Sandbox Buyer Requirement:**  
> PayPal India does **not** support domestic INR-to-INR transactions. When completing checkout on an innovation project, **always log in with a US Sandbox Buyer account** (`Country: United States`) with available USD balance (e.g. `sb-49o1l53655900@business.example.com`). An Indian buyer account will fail with *"This seller doesn't accept payments in your currency"*.

---

## 🗄️ Database Schema & DDL
Full PostgreSQL DDL and seed scripts are included in `supabase/`:
- `supabase/schema.sql`: 16 tables, constraints, indexes, and Row Level Security (RLS) policies.
- `supabase/seed.sql`: Preloaded users (Daksh, Rahul, Jay, Sneha, Admin), Goa Trip expenses, and student projects.

---

## ☁️ Deployment on Render

GroupFund AI is deployed on **Render** at [https://groupfund-ai.onrender.com/](https://groupfund-ai.onrender.com/).

The application is deployed as a **Node.js Web Service** (rather than a static site) because it utilizes Next.js 16 server-side API routes (`/api/paypal/*`, `/api/ai/*`), dynamic SSR, and server-side cryptographic PayPal order creation and capture.

For step-by-step instructions on setting up environment variables and deploying on Render, refer to [`RENDER_DEPLOYMENT.md`](RENDER_DEPLOYMENT.md).

---

## 📄 License
This project is licensed under the [MIT License](LICENSE) — Copyright (c) 2026 Daksh Patel.
