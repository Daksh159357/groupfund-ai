# 🚀 GroupFund AI — Pitch Deck Outline

> **Theme:** Manage Money Together. Fund Innovation Together.  
> **Target Audience:** Hackathon Judges, Angel Investors, Student Founders & Campus Communities  
> **Presentation Duration:** 3–5 Minutes

---

## Slide 1: Title & Hero
- **Header:** GroupFund AI
- **Tagline:** Manage Money Together. Fund Innovation Together.
- **Subtext:** The intelligent financial operating system connecting peer group expense splitting with student hardware and AI crowdfunding.
- **Presenter:** Daksh Sharma & Team
- **Visual Suggestion:** High-res mockup of the GroupFund AI dashboard showing the dual-engine split balance (₹10,000 Goa Trip) alongside an autonomous student robotics grant (AgriBot).

---

## Slide 2: The Problem — Fragmented Campus Finances
- **Header:** The Student Finance Paradox
- **Bullet Points:**
  - **Social Spending is Broken:** Splitwise has paywalled basic features, lacks automated receipt OCR, and forces awkward manual debt tracking.
  - **Crowdfunding Excludes Students:** Kickstarter, GoFundMe, and Indiegogo demand corporate registrations, charge 8–10% platform cuts, and offer zero milestone verification for technical prototypes.
  - **The Deadweight Loss:** Over $1.2B in informal student project pools and campus trip money is trapped in fragmented UPI screenshots, unorganized chats, and lost receipts.
- **Key Takeaway:** Students have to juggle 4 separate apps just to split a dinner, budget a hackathon trip, and raise ₹50,000 for a drone chassis.

---

## Slide 3: The Solution — The Unified Financial Ecosystem
- **Header:** One Platform. Total Financial Intelligence.
- **Bullet Points:**
  - **Dual Engine Architecture:**
    1. **Social Expense Hub:** Real-time expense splitting, itemized receipt breakdown, and greedy graph-based debt simplification.
    2. **Innovation Crowdfunding:** Direct-to-prototype micro-grants verified by milestone deliverables and transparent budgets.
  - **Zero Friction Onboarding:** Interactive 30-second guided tour and instant invite codes without requiring complex KYC for small peer circles.
  - **Instant Global Checkout:** Back any campus hardware innovation with PayPal Sandbox checkout in seconds.
- **Visual Suggestion:** Split-screen infographic showing peer expenses settling on the left flowing into student robotics funding on the right.

---

## Slide 4: How It Works — Algorithmic Integrity
- **Header:** Mathematical Precision & Milestone Escrow
- **Bullet Points:**
  - **Paise-Level Financial Engine:** All balances stored as 64-bit integers (`amountPaise`). Floating-point rounding errors ($0.1 + $0.2 \neq 0.3) are mathematically eliminated.
  - **Min-Cash-Flow Optimization:** Graph-theoretic debt simplification algorithm reduces $N$-person settlement transactions from $O(N^2)$ to at most $N-1$ bilateral transfers.
  - **Milestone-Gated Deliverables:** Student project budgets are partitioned into discrete milestones (e.g., *Chassis Assembly*, *PCB Fabrication*, *Field Trials*). Backers review photo and code evidence before subsequent budget tranches unlock.
- **Visual Suggestion:** Visual graph reduction: 5 friends with 10 messy IOUs simplified into 3 clean arrow transfers.

---

## Slide 5: Autonomous AI Integration — Powered by Google Gemini
- **Header:** Your Autonomous Campus Financial Copilot
- **Bullet Points:**
  - **Multi-Modal Receipt OCR (`/api/ai/scan-receipt`):** Upload crumpled food or hardware store receipts. Gemini Flash parses merchant name, line items, taxes, and exact rupee totals instantly into split transactions.
  - **Automated Grant Writer (`/api/ai/project-assistant`):** Turn a 2-sentence student idea into a structured 5-part grant proposal complete with realistic budget breakdowns and milestone timelines.
  - **Milestone Verification Agent (`/api/ai/analyze-milestone`):** Evaluates student lab submissions, GitHub commits, and component photos against project criteria to advise community backers before release.
- **Visual Suggestion:** Live preview of Gemini scanning a hardware store invoice and populating line-item splits in 1.2 seconds.

---

## Slide 6: Real-World Money Movement — PayPal Sandbox Architecture
- **Header:** Bank-Grade International Checkout
- **Bullet Points:**
  - **Server-Side Order Generation:** Orders created via secure server-side PayPal REST v2 API calls with strict idempotency keys.
  - **Safe Server-Side Capture (`/api/paypal/capture-order`):** The client never directly confirms funds. Double-capture attacks return HTTP 409 Conflict.
  - **Seamless Cross-Border Rate Bridging:** Dual-currency bridge: charges international backers in USD ($1.20) at a fixed demo peg (₹83 = $1) while keeping the university recipient ledger strictly in INR paise.
  - **Zero Escrow Legal Liability:** Transparent disclaimers stating peer-to-peer backing without holding unauthorized banking custody.
- **Visual Suggestion:** PayPal modal checkout flow reaching `COMPLETED` status followed by celebratory confetti on the AgriBot project.

---

## Slide 7: Production-Ready Tech Stack
- **Header:** Engineered for Speed, Reliability, and Scale
- **Bullet Points:**
  - **Frontend & Server Engine:** Next.js 16 (Turbopack, Server Components, Partial Prerendering) + React 19.
  - **Styling & UI:** Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti.
  - **Database & Sync:** Supabase (PostgreSQL schema) + Reactive LocalStorage Store with hydration guards.
  - **Artificial Intelligence:** Google Gemini Multi-Modal API (Flash & Pro).
  - **Payments:** PayPal REST APIs (v2 Orders, Capture, Webhooks).
  - **Testing & Video Automation:** Playwright Chromium headless/headed end-to-end test runner.
- **Visual Suggestion:** Architecture diagram illustrating Client ⇄ Next.js Server Actions ⇄ PayPal / Gemini / Supabase.

---

## Slide 8: The Vision — The Financial Layer for Student Builders
- **Header:** Scaling Beyond Campus
- **Bullet Points:**
  - **Campus Micro-Grants:** Partnering with university E-Cells, incubation centres, and makerspaces to disburse institutional alumni grants directly into verified milestones.
  - **UPI & International Payment Rails:** Pairing domestic UPI Instant Split with international PayPal backing for overseas diaspora alumni.
  - **Reputation-Linked Founder Graph:** Turning student milestone execution records into verifiable on-chain or portfolio credentials for venture capital talent scouts.
- **Call to Action:** **Try the live demo at localhost:3000** or back a student robotics project today!

