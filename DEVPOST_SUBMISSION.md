# 🏆 Devpost Submission: GroupFund AI

Copy and paste the sections below directly into the Devpost submission form.

---

### 1. General Project Details

- **Project Name:** GroupFund AI
- **Elevator Pitch:**  
  Manage group money and fund student innovation on one AI-powered platform. Split trips seamlessly and crowdfund robotics projects with PayPal.

---

### 2. Built With (Tags)
```text
next.js, react, typescript, tailwindcss, gemini-ai, paypal-api, supabase, zod, playwright
```

---

### 3. Project Story

#### 💡 Inspiration
As college students, we constantly ran into two massive financial frustrations:
1. **Splitting group expenses is painful:** Trips, hackathons, and dinners end in messy WhatsApp chats, lost paper receipts, and awkward debt reminders. Existing apps like Splitwise have paywalled essential features and lack automated receipt parsing.
2. **Student engineering projects die without micro-funding:** Campus hardware clubs, autonomous robotics prototypes, and AI makerspaces struggle to raise ₹10,000–₹50,000. Traditional platforms like Kickstarter demand corporate entities, take high fees, and offer zero laboratory milestone verification.

We asked: *What if the same financial operating system that splits your trip expenses could also crowdfund your robotics prototype with global PayPal backing?* That is why we built **GroupFund AI**.

#### 🚀 What It Does
GroupFund AI unites two modules on a single shared financial ledger:
- **Module A (Group Expenses):** Create social groups (e.g. *College Trip Goa 2026*), snap receipts with **Gemini Multimodal OCR**, and split bills with **exact integer paise arithmetic**. Our **Min-Cash-Flow algorithm** simplifies complex web debts down to the minimal bilateral payments ($O(N^2) \to N-1$).
- **Module B (Innovation Crowdfunding):** Student builders publish prototypes (e.g. *Autonomous AgriBot*), define milestone budgets, and receive international backing via **PayPal Sandbox Orders v2 API** with server-side verified capture.
- **Unified AI Copilot:** A multimodal Gemini assistant answers queries across both modules (*"Who owes me money?"*, *"Draft a grant proposal for my drone prototype"*).

#### 🛠️ How We Built It
- **Frontend & App Architecture:** Next.js 16 (Turbopack, Server Actions, Partial Prerendering) with React 19 and Tailwind CSS v4.
- **Financial Arithmetic Engine:** Custom integer paise math engine (`1 INR = 100 paise`) preventing IEEE-754 floating-point rounding errors ($0.1 + $0.2 \neq 0.3).
- **Graph Algorithm:** Min-Cash-Flow greedy reduction algorithm for debt simplification.
- **PayPal Integration:** Server-side PayPal REST Orders v2 API (`/api/paypal/create-order` and `/api/paypal/capture-order`) with strict idempotency keys and duplicate-capture rejection (HTTP 409).
- **Google Gemini 2.5 Flash:** Multimodal vision for receipt OCR (`/api/ai/scan-receipt`), technical grant proposal drafting (`/api/ai/project-assistant`), and milestone progress verification (`/api/ai/analyze-milestone`).
- **Database & State:** Supabase PostgreSQL with RLS schema + reactive store with hydration mismatch protection.
- **Testing & Video:** Automated Playwright end-to-end recording script and ffmpeg universal MP4 conversion.

#### 🧗 Challenges We Ran Into
1. **PayPal India Domestic Currency Restriction:** PayPal does not support domestic INR-to-INR merchant payments in India. When testing sandbox payments, India-to-India accounts failed with currency errors. We solved this by architecting a **cross-border USD/INR dual-currency bridge**: PayPal charges international sandbox buyers in USD at a fixed demo exchange rate (₹83 = $1 USD), while storing the original INR paise amount in `purchase_units[0].custom_id`. The server verifies capture and credits the student project strictly in integer paise.
2. **Paise-Level Exactness & Remainder Distribution:** Dividing ₹100.00 among 3 people creates fractional paise (33.333...). We solved this with remainder distribution, crediting the 1-paise remainder to the payer so that $\sum \text{shares} \equiv \text{total}$ without losing a single paise.
3. **React SSR Hydration with Local Persistence:** Server-rendered initial state differed from client-side stored balances after PayPal transactions. We implemented an `isMounted` skeleton pattern and deferred store initialization to client hydration, achieving 0 console warnings.

#### 🏅 Accomplishments That We're Proud Of
- **Flawless End-to-End PayPal Orders v2 Flow:** Real server-side order generation, redirect to PayPal Sandbox, secure server capture, and instant celebratory confetti.
- **Production-Ready Next.js 16 Build:** 30 routes compiled with zero TypeScript or linting errors.
- **Native Browser Pitch Deck (`/slides`):** Built-in 8-slide presentation deck directly inside the application for seamless judge demonstrations.
- **Built-in First-Time Onboarding Tour:** 5-step interactive Joyride walkthrough with dark backdrop spotlights.

#### 📖 What We Learned
- How to architect robust, idempotent payment lifecycles using PayPal's REST v2 API.
- Prompt engineering structured JSON extraction using Gemini 2.5 Flash multimodal vision.
- Handling cross-border exchange rate conversions while maintaining ledger purity.

#### 🔮 What's Next for GroupFund AI
- Campus Micro-Grants partnership with university E-Cells and makerspaces.
- Integration with Indian UPI AutoPay for instant peer-to-peer settlement alongside international PayPal rails.
- On-chain or verifiable founder reputation credentials derived from milestone execution history.

---

### 4. How It Meets The Tech Requirements

#### 💳 PayPal Technology: PayPal REST Orders v2 API (Sandbox)
- **Server-Side Order Creation:** Handled in `/api/paypal/create-order` using PayPal REST Orders v2 (`POST /v2/checkout/orders`) with bearer OAuth token authentication. Sets `intent: "CAPTURE"`, `application_context.return_url`, and `application_context.cancel_url`.
- **Server-Side Cryptographic Capture:** Handled in `/api/paypal/capture-order` (`POST /v2/checkout/orders/{id}/capture`). The client cannot fake payments; only verified PayPal `COMPLETED` webhook/capture responses credit the project.
- **Idempotency & Replay Protection:** In-memory and database uniqueness checks reject duplicate captures with `HTTP 409 Conflict`.
- **Dual-Currency Bridge:** Enables international sandbox accounts to back Indian student projects seamlessly via USD conversion at ₹83 = $1.

#### 🤖 AI Technology: Google Gemini API (2.5 Flash)
- **Multimodal Receipt OCR (`/api/ai/scan-receipt`):** Gemini Flash analyzes uploaded receipt images (JPG/PNG) to extract merchant, date, tax, itemized line items, and totals into structured JSON.
- **AI Proposal Generator (`/api/ai/project-assistant`):** Converts short student concepts into structured 5-part grant proposals with bill of materials (BOM) and milestone timelines.
- **Milestone Auditing (`/api/ai/analyze-milestone`):** Evaluates student lab photos and code submissions against milestone objectives.

---

### 5. Devpost Feedback Questions

- **Rating of the PayPal APIs & Developer Experience:** 10 / 10
- **What worked well?** The PayPal REST Orders v2 documentation and sandbox dashboard made creating merchant apps, tracking sandbox accounts, and inspecting webhook events intuitive and straightforward.
- **What could be improved?** Clearer developer documentation on sandbox domestic currency restrictions (e.g. India INR domestic limitations) would save developers significant debugging time.
