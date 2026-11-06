# 🏆 Devpost Submission: GroupFund AI

Use this document to copy and paste directly into the Devpost submission form for the **PayPal AI Hackathon**.

---

### Project Name
**GroupFund AI**

---

### Elevator Pitch
Manage group money and fund student innovation on one AI-powered platform. Split trips seamlessly and crowdfund robotics projects with PayPal.

---

### Inspiration
Student innovators struggle to fund hardware prototypes, while the same students use clunky tools to split rent and trip expenses. We wanted one unified financial platform for campus life.

---

### What it does
GroupFund AI has two modules:
* **Module A (Group Expenses):** Splits group expenses using exact integer paise math (preventing any floating-point rounding errors) and runs a mathematically optimal Min-Cash-Flow algorithm for minimal debt settlements.
* **Module B (Innovation Crowdfunding):** Allows students to crowdfund innovations (such as robotics and AI prototypes), backed by PayPal Sandbox payments. It uses Google Gemini AI to scan receipts, draft funding proposals, and analyze milestone progress evidence.

---

### How we built it
* **Framework:** Next.js 16 (App Router with Turbopack and React 19)
* **Language & Styling:** TypeScript, Tailwind CSS v4, Lucide React, Framer Motion
* **Database & Auth:** Supabase (PostgreSQL with Row Level Security) + Local resilient fallback store
* **AI Engine:** Google Gemini 2.5 Flash API (Multimodal receipt OCR, proposal generator, milestone risk analyzer)
* **Payment Gateway:** PayPal REST API (Orders v2 Sandbox) with server-side capture verification
* **Testing & Automation:** Playwright for end-to-end testing and demo video recording
* **Data Visualization:** Recharts for financial charts and analytics
* **Deployment:** Render Node.js Web Service

---

### Challenges we ran into
* **PayPal India Domestic Currency Restrictions:** PayPal India does not permit domestic INR-to-INR sandbox payments. We solved this elegantly by architecting a cross-border USD/INR dual-currency bridge: the buyer pays in USD at a fixed demo exchange rate ($1 USD = ₹83 INR), while the exact INR paise amount is preserved in `purchase_units[0].custom_id`. Upon server-side capture, the student project ledger updates strictly in integer INR paise without loss.
* **Next.js SSR Hydration with Local Storage:** Balancing server-rendered static HTML with client-side user session preferences was resolved using hydration guards (`suppressHydrationWarning`, `isHydrated` context flags).
* **AI Resilience:** Creating a reliable fallback simulator that mirrors Gemini schema outputs so the entire application remains interactive even when network or rate-limit issues arise.

---

### Accomplishments that we're proud of
* **100% Server-Side PayPal Capture Verification:** Frontend client tokens are never trusted for financial state updates. Order creation and captures happen entirely through backend Next.js API routes with strict idempotency (HTTP 409 Conflict on replay attempts).
* **The Min-Cash-Flow Debt Simplification Algorithm:** Reduces complex multi-party debts down to the minimum possible transactions.
* **Paise-Level Exact Math:** All financial calculations are done in integer paise, eliminating JavaScript floating-point errors (`0.1 + 0.2 !== 0.3`).
* **Resilient Mock-Fallback Architecture:** The entire app runs smoothly with or without live API keys.

---

### What we learned
* Deepened our understanding of payment gateways, OAuth2 server-side handshakes, and cryptographic capture verification.
* Mastered React 19 / Next.js 16 SSR hydration lifecycles.
* Learned how to build resilient, production-grade multimodal AI integrations with structured JSON schemas.

---

### What's next for GroupFund AI
* Expanding to campus-wide micro-grants and university departmental grants.
* Establishing institutional partnerships with robotics labs and incubation centers.
* Integrating the PayPal Payouts API for automated milestone disbursements directly into student innovators' verified accounts once peer reviews pass.

---

### Built With Tags
`Next.js`, `React`, `TypeScript`, `Tailwind CSS`, `Gemini AI`, `PayPal API`, `Supabase`, `Zod`, `Playwright`, `Lucide React`, `Recharts`

---

### "Explain how your project meets the main technology requirement"
We used the **PayPal REST API v2 (Sandbox)** for creating orders (`POST /v2/checkout/orders`), redirecting users to the secure approve URL, and capturing payments server-side (`POST /v2/checkout/orders/{id}/capture`) with idempotency protection and dual-currency bridge support.

We used **Google Gemini 2.5 Flash** for multimodal receipt OCR (extracting itemized line items, tax, and totals from camera/invoice uploads), intelligent project proposal drafting with BOM budgets, and milestone progress analysis of engineering evidence.

---

### Live Demo & Repository Links
* **Live Demo URL:** [https://groupfund-ai.onrender.com/](https://groupfund-ai.onrender.com/)
* **GitHub Repository:** [https://github.com/Daksh159357/groupfund-ai](https://github.com/Daksh159357/groupfund-ai)
* **In-App Slide Deck:** [https://groupfund-ai.onrender.com/slides](https://groupfund-ai.onrender.com/slides)
