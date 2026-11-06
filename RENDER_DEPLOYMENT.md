# Render Production Deployment Guide for GroupFund AI

This guide walks you through configuring and deploying **GroupFund AI** on [Render](https://render.com) as a production **Web Service** (Node.js/Next.js).

**Live App URL:** [https://groupfund-ai.onrender.com/](https://groupfund-ai.onrender.com/)

---

## 1. Web Service Configuration on Render

GroupFund AI relies on Next.js 16 App Router with server-side API endpoints (`/api/paypal/*`, `/api/ai/*`), dynamic SSR, and background execution. It must be deployed as a **Web Service**, not a Static Site.

* **Environment:** `Node`
* **Build Command:** `npm install && npm run build`
* **Start Command:** `npm run start`

---

## 2. Environment Variables Setup (Render Dashboard)

1. Open your [Render Dashboard](https://dashboard.render.com).
2. Select your **groupfund-ai** Web Service.
3. In the left navigation menu, click **Environment**.
4. Add the following environment variables:

| Variable Name | Required? | Example / Value | Description |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | **Yes** | `https://groupfund-ai.onrender.com` | **Production Base URL** for PayPal return/cancel redirects and webhooks. |
| `GEMINI_API_KEY` | **Yes** | `AQ.Ab8RN6...` | Google Gemini API Key for multimodal receipt OCR, proposal generator, and AI assistant. |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | **Yes** | `AX...` | **US Sandbox Merchant Client ID** from PayPal Developer Dashboard. |
| `PAYPAL_CLIENT_SECRET` | **Yes** | `EM...` | **US Sandbox Merchant Secret** for server-side OAuth2 token generation and order capture. |
| `PAYPAL_ENVIRONMENT` | **Yes** | `sandbox` | Set to `sandbox` for hackathon evaluation and grading. |
| `NEXT_PUBLIC_DEFAULT_CURRENCY` | Optional | `INR` | Default display currency (defaults to INR). |
| `PAYPAL_WEBHOOK_ID` | Optional | `WH-SANDBOX-12345` | PayPal Webhook verification ID for automated status updates. |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | `https://your-proj.supabase.co` | Supabase Postgres URL (if using external DB). Local store fallback activates automatically if empty. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | `eyJhbGciOi...` | Supabase Public Anonymous Key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | `eyJhbGciOi...` | Supabase Service Role Key for backend administration. |

---

## 3. Important PayPal Sandbox Notice (Judges & Evaluation)

> [!IMPORTANT]
> **PayPal Account Geolocation Rule:**
> PayPal India domestic INR-to-INR sandbox payments are restricted by regulatory policies. 
> To test the checkout flow:
> 1. Your merchant credentials (`NEXT_PUBLIC_PAYPAL_CLIENT_ID` & `PAYPAL_CLIENT_SECRET`) must belong to a **US-based Sandbox Business Account**.
> 2. The buyer account used to log in and approve the payment must also be a **US Sandbox Personal Account** (`buyer-us@personal.example.com`).
> 3. GroupFund AI features an automated currency conversion bridge (\$1 USD = ₹83 INR) embedded in the PayPal order payload to ensure seamless, compliant payments.

---

## 4. Triggering Deployment

Every push to your GitHub repository `main` branch automatically triggers a rebuild on Render:
1. Render clones the repository.
2. Runs `npm install` and compiles Next.js with `npm run build`.
3. Boots the container with `npm run start` on port 10000.
4. Verify by opening [https://groupfund-ai.onrender.com/dashboard](https://groupfund-ai.onrender.com/dashboard).

