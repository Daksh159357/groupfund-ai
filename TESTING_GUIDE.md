# GroupFund AI — Judge & Tester Guide

Welcome judges! This guide provides everything you need to test the live payment flows, AI features, and group expense engine of **GroupFund AI**.

---

## 💳 PayPal Sandbox Test Credentials (For Judges)

When testing prototype crowdfunding contributions via PayPal Sandbox, use the following pre-configured US Personal Sandbox Buyer credentials:

- **Buyer Email:** `sb-y0f8653836626@personal.example.com`
- **Buyer Password:** `DC%9ohe/`
- **Account Type:** Personal (United States)
- **Preloaded Balance:** \$5,000.00 USD

> [!WARNING]
> **You MUST use this Personal account to log in at checkout.**  
> **Do NOT use a Business account or an India-based account**, as PayPal will block the transaction with a *"seller cannot buy from themselves"* or cross-border currency restriction error.

---

## 🧪 Step-by-Step Testing Walkthrough

### 1. Test PayPal Crowdfunding Backing
1. Navigate to **Discover Projects** (`/discover`) or click **AgriBot** on the home page.
2. Open any project, e.g. [AgriBot: Autonomous Precision Agricultural Robot](/projects/proj-agribot).
3. In the right-hand backing panel, choose a tier (e.g., ₹500 or ₹1,000) or enter a custom amount.
4. Click **PayPal Sandbox Checkout**.
5. When the PayPal popup/tab loads:
   - Enter Email: `sb-y0f8653836626@personal.example.com`
   - Enter Password: `DC%9ohe/`
6. Click **Complete Purchase**.
7. You will be redirected back to the project page:
   - Server-side cryptographic capture verifies the payment (`/api/paypal/capture-order`).
   - Confetti triggers on approval.
   - The project's raised funding amount and backers count increment immediately in the ledger.
   - The URL is automatically sanitized (removing token and query parameters).

### 2. Test Checkout Cancellation
1. In the same project backing panel, click **PayPal Sandbox Checkout**.
2. On the PayPal login screen, click **Cancel and return to GroupFund AI** (or **Return to merchant**).
3. You will be redirected cleanly to the **Dashboard** (`/dashboard`).
4. An informational banner appears: *"PayPal checkout was cancelled. No funds were deducted."*
5. The URL query parameters are automatically cleaned from the browser address bar, and project funds remain completely unaffected.

---

### 3. Test Multimodal Receipt OCR (Gemini 2.5 Flash)
1. Go to **Dashboard** or **Expenses** and click **+ Add Expense**.
2. Click the **Receipt Scanner** tab or drag-and-drop a receipt image.
3. Gemini extracts the merchant name, date, subtotal, tax, and itemized lines automatically.
4. Select split members (e.g., equal 5-way split) and save — integer paise math guarantees 0.00% rounding drift.

---

### 4. Test Min-Cash-Flow Debt Simplification
1. Open the preloaded group: **College Trip Goa 2026** (`/groups/group-goa-2026`).
2. Review the member balance chart and greedy graph settlement plan.
3. Notice how 12 multi-party debts are collapsed into just 3 minimal payments to zero everyone out.

---

## 🔗 Useful Links
- **Live Deployment:** [https://groupfund-ai.onrender.com](https://groupfund-ai.onrender.com)
- **Interactive Pitch Deck:** [https://groupfund-ai.onrender.com/slides](https://groupfund-ai.onrender.com/slides)
- **GitHub Repository:** [https://github.com/Daksh159357/groupfund-ai](https://github.com/Daksh159357/groupfund-ai)

