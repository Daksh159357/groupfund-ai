# 🚀 Vercel Deployment Guide — GroupFund AI

This guide walks you through deploying **GroupFund AI** to [Vercel](https://vercel.com) for your hackathon submission.

---

## ⚡ 1-Click / Git Deployment Steps

### Step 1: Push Code to GitHub
Ensure all your latest commits are pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: complete GroupFund AI platform for submission"
git push origin main
```

### Step 2: Import Project into Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** &rarr; **"Project"**.
3. Select your GitHub repository (`paypal` or `groupfund-ai`).
4. Framework Preset: **Next.js** (automatically detected).
5. Root Directory: `./` (leave default).

---

## 🔑 Environment Variables to Configure in Vercel

Before clicking **Deploy**, expand the **"Environment Variables"** accordion in the Vercel project configuration and add the following keys:

| Environment Variable | Value | Description | Required? |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` *(or custom domain)* | Production base URL used for PayPal return/cancel redirects | **Required** |
| `NEXT_PUBLIC_DEFAULT_CURRENCY` | `INR` | Default display currency | **Required** |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | `BAAD-vGxO9DVgp2aqGRcv5jH6UCpakPx82YJ4fwQt-56lj1EFpuiBaAXHJWy4i4hBwrkE6vOGDCZJ7QX0M` | US Merchant Sandbox Client ID | **Required for PayPal** |
| `PAYPAL_CLIENT_SECRET` | `ENu6WDfu9QIt9nXI23nZBdAOSC7018xlmG-4pTBYcffQqaZpBxIqgTGISmhAbepviLtHaGKILnva5YNL` | US Merchant Sandbox Secret | **Required for PayPal** |
| `PAYPAL_ENVIRONMENT` | `sandbox` | Sets PayPal SDK to Sandbox mode | **Required** |
| `GEMINI_API_KEY` | *(Your Google Gemini API Key)* | Multimodal OCR & Project Assistant | *Optional (Smart fallbacks active)* |
| `NEXT_PUBLIC_SUPABASE_URL` | *(Optional Supabase Project URL)* | Production database URL | *Optional (Client store active)* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Optional Supabase Anon Key)* | Production database public key | *Optional (Client store active)* |

> [!IMPORTANT]
> **No Database Setup Required for Judges:**  
> GroupFund AI includes a **zero-dependency reactive store with localStorage persistence**. If you do not connect Supabase, the app will run with all seed data (Goa Trip expenses, AgriBot prototype, settlements) and persist all user contributions, new groups, and payments in the browser session.

---

## 💳 PayPal Return URL Note for Production
When deploying to Vercel, make sure `NEXT_PUBLIC_APP_URL` matches your actual production URL (e.g. `https://groupfund-ai.vercel.app`).  
This ensures that after a judge approves a contribution on `sandbox.paypal.com`, PayPal redirects them back to `https://groupfund-ai.vercel.app/projects/proj-agribot?token=...` to trigger server-side capture and celebratory confetti!

---

## 🛠️ Post-Deployment Verification
1. Open your Vercel deployment URL.
2. Check that the Dashboard loads smoothly with no console hydration warnings.
3. Visit `/slides` to verify your browser-based presentation deck is live.
4. Test the contribution flow on **AgriBot** using a **US Personal Sandbox Account** to confirm live payment capture.

