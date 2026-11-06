# 📋 Hackathon Submission Checklist

Use this checklist to ensure all code, credentials, and presentation materials are in order before final submission.

---

### 1. Security & Credentials
- [ ] **`.env.local` is NOT committed to GitHub:** Checked via `.gitignore` and `git status`. Ensure private keys (`PAYPAL_CLIENT_SECRET`, `GEMINI_API_KEY`) remain strictly local.
- [ ] **`.env.example` is clean & updated:** Contains placeholders without real production credentials.
- [ ] **Deployment Environment Variables Configured (if hosting on Vercel/Render):**
  - `NEXT_PUBLIC_APP_URL`
  - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
  - `PAYPAL_CLIENT_SECRET`
  - `PAYPAL_ENVIRONMENT=sandbox`
  - `GEMINI_API_KEY` (optional)

---

### 2. Build & Code Quality
- [ ] **`npm run build` passes with zero errors:**
  - Tested with Turbopack & Next.js 16 compiler.
  - All 29 dynamic and prerendered routes compile cleanly.
- [ ] **No Hydration Warnings:** Verified that `isMounted` guards protect client/server text matches.
- [ ] **No Console Spam:** Check browser DevTools console to ensure clean logs during standard user flows.

---

### 3. Payment & Ledger Verification
- [ ] **PayPal Sandbox Integration Verified:**
  - Order creation returns valid approve link.
  - User redirects to sandbox approval.
  - Return URL captures order and marks status `COMPLETED`.
  - Double-capture attempts return HTTP 409 Conflict.
- [ ] **US Buyer Note Documented:** Judges are informed in the README to use a US Sandbox Buyer account to avoid domestic INR currency restrictions.
- [ ] **Integer Paise Integrity:** Financial arithmetic verified strictly in paise (e.g. ₹100 = 10,000 paise).

---

### 4. Demo Assets & Submission Links
- [ ] **Pitch Deck Prepared:** Ready in Canva / Google Slides using the 8-slide outline in [`PITCH_DECK.md`](file:///home/kali/get_back_to-work/paypal/PITCH_DECK.md).
- [ ] **Demo Video Finalized:**
  - Recorded via `npm run record-demo` or screen recorder.
  - Converted from `.webm` to `.mp4` using `ffmpeg`.
  - Video uploaded to YouTube (Unlisted) or Loom.
- [ ] **GitHub Repository Public & Formatted:**
  - `README.md` clearly describes features, tech stack, and setup steps.
  - Clean commit history on `main` branch.

