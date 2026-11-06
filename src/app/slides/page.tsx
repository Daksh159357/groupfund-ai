'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Plane,
  Rocket,
  Bot,
  Wallet,
  Scale,
  ShieldCheck,
  Cpu,
  Layers,
  Globe,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Home,
  Receipt,
  Users,
  Code,
  Zap,
} from 'lucide-react';

export default function SlidesPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Title & Hero
    {
      badge: 'Hackathon Pitch Presentation',
      title: 'GroupFund AI',
      subtitle: 'Manage Money Together. Fund Innovation Together.',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-6">
          <div className="space-y-6">
            <p className="text-xl sm:text-2xl text-slate-300 font-light leading-relaxed">
              The unified financial operating system connecting <span className="text-blue-400 font-semibold">peer group expense splitting</span> with <span className="text-indigo-400 font-semibold">student hardware and AI crowdfunding</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5">
                <Receipt className="w-4 h-4" /> Equal & Custom Splits
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center gap-1.5">
                <Rocket className="w-4 h-4" /> Prototype Grants
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
                <Bot className="w-4 h-4" /> Gemini AI Multimodal
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> PayPal Sandbox Orders v2
              </span>
            </div>
            <div className="pt-2 text-slate-400 text-sm flex items-center gap-2">
              <span className="text-slate-200 font-semibold">Presenters:</span> Daksh Sharma & Team &bull; IIT Bombay
            </div>
          </div>
          <div className="relative p-6 rounded-3xl border border-slate-800 bg-gradient-to-tr from-slate-900 via-blue-950/20 to-indigo-950/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Live Platform Ledger</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                COMPLETED
              </span>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-xs text-white font-semibold">College Trip Goa 2026</p>
                  <p className="text-[10px] text-slate-400">Min-Cash-Flow Greedy Debt Settlement</p>
                </div>
                <p className="text-emerald-400 font-mono font-bold text-sm">₹10,000.00</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-xs text-white font-semibold">Autonomous AgriBot Prototype</p>
                  <p className="text-[10px] text-slate-400">PayPal Verified Server Capture</p>
                </div>
                <p className="text-indigo-400 font-mono font-bold text-sm">₹7,05,100.00</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 2: The Problem
    {
      badge: 'Market Inefficiency',
      title: 'The Student Finance Paradox',
      subtitle: 'Why campus money management is fundamentally broken today.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-6 rounded-3xl border border-rose-500/20 bg-gradient-to-b from-rose-950/20 to-slate-900/60 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xl">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Splitwise Paywalls & Clutter</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Basic features are now paywalled behind expensive subscriptions. No automated OCR receipt scanning, no student discounts, and zero milestone integration.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-950/20 to-slate-900/60 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xl">
              2
            </div>
            <h3 className="text-lg font-bold text-white">Kickstarter Excludes Students</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Traditional crowdfunding requires registered legal entities, takes 8-10% cuts, and does not support granular laboratory milestones for experimental student robotics.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/20 to-slate-900/60 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xl">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Fragmented Social Debt</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Over $1.2B in informal student peer expenses and project pools is lost across messy WhatsApp chats, unorganized screenshots, and forgotten IOUs.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 3: The Solution
    {
      badge: 'Unified Architecture',
      title: 'One Platform. Total Financial Intelligence.',
      subtitle: 'Fusing social expense splits and prototype crowdfunding on a single ledger.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="p-7 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/20 to-slate-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Module A: Group Expense Hub</h3>
                <p className="text-xs text-blue-400 font-semibold">Social Travel, Trips, Hostels & Dinners</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Exact integer paise arithmetic prevents floating-point rounding errors.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Min-Cash-Flow graph debt simplification reduces transfers to at most N-1.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multimodal receipt OCR splits items, tax, and tips automatically.</span>
              </li>
            </ul>
          </div>

          <div className="p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 to-slate-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Module B: Innovation Crowdfunding</h3>
                <p className="text-xs text-indigo-400 font-semibold">Robotics, AI, IoT & CleanTech Prototypes</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Milestone-gated releases with transparent BOM budgets and progress logs.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Global PayPal Sandbox checkout with verified server-side capture.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI Project Assistant generates structured technical grant proposals in seconds.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 4: Algorithmic Integrity
    {
      badge: 'Mathematical Foundation',
      title: 'Algorithmic Precision & Graph Optimization',
      subtitle: 'Zero floating-point rounding errors + Greedy Min-Cash-Flow reduction.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Scale className="w-5 h-5" />
              <span>Exact Integer Paise Accounting</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard JavaScript floats suffer from IEEE-754 precision bugs ($0.1 + $0.2 = 0.30000000000000004). GroupFund AI stores every balance as 64-bit integer paise (`amountPaise`).
            </p>
            <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-800 space-y-1">
              <div>₹100 / 3 people = 3,333 paise each</div>
              <div>Remainder: 1 paise &rarr; Payer gets exact credit</div>
              <div className="text-slate-400 text-[10px]">Total: 3334 + 3333 + 3333 = 10000 paise (₹100.00)</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Layers className="w-5 h-5" />
              <span>Min-Cash-Flow Greedy Debt Simplification</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Collapses arbitrary cross-peer transactions from $O(N^2)$ down to at most $N-1$ bilateral transfers.
            </p>
            <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-blue-300 border border-slate-800 space-y-1">
              <div>5 friends spend ₹10,000 on Goa trip:</div>
              <div className="text-slate-200">1. Harsh pays Daksh ₹1,500</div>
              <div className="text-slate-200">2. Meet pays Daksh ₹1,000</div>
              <div className="text-slate-200">3. Jay pays Daksh ₹500</div>
              <div className="text-emerald-400 text-[10px]">All 5 debts settled in exactly 3 transactions!</div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 5: AI Integration
    {
      badge: 'Multimodal Intelligence',
      title: 'Autonomous AI Copilot — Powered by Gemini',
      subtitle: 'Multi-modal computer vision and reasoning deployed at every step.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-6 rounded-3xl border border-violet-500/20 bg-slate-900/60 space-y-3">
            <div className="p-3 rounded-2xl bg-violet-600/20 text-violet-400 w-fit">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Receipt OCR Vision</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upload crumpled hardware invoices or restaurant bills. Gemini 2.5 Flash extracts merchant name, date, line items, and taxes with sub-second latency.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-blue-500/20 bg-slate-900/60 space-y-3">
            <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 w-fit">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI Grant Proposal Writer</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Input a 2-sentence student robotics concept. The agent generates a comprehensive technical proposal, bill of materials (BOM), and milestone budget allocation.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-emerald-500/20 bg-slate-900/60 space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Milestone Verification</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Evaluates laboratory photos, GitHub commits, and sensor logs against project objectives to advise community backers before funding tranches unlock.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 6: Money Movement
    {
      badge: 'Bank-Grade Infrastructure',
      title: 'Real-World Money Movement & PayPal Capture',
      subtitle: 'Server-side cryptographic capture + USD/INR dual-currency bridge.',
      content: (
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-1">
              <div className="text-indigo-400 font-bold text-sm">Step 1</div>
              <p className="text-xs font-semibold text-white">POST /create-order</p>
              <p className="text-[10px] text-slate-400">Server creates PayPal v2 order</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-1">
              <div className="text-indigo-400 font-bold text-sm">Step 2</div>
              <p className="text-xs font-semibold text-white">User Approval</p>
              <p className="text-[10px] text-slate-400">Approved at sandbox.paypal.com</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-1">
              <div className="text-indigo-400 font-bold text-sm">Step 3</div>
              <p className="text-xs font-semibold text-white">POST /capture-order</p>
              <p className="text-[10px] text-slate-400">Server captures with secret key</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-1">
              <div className="text-emerald-400 font-bold text-sm">Step 4</div>
              <p className="text-xs font-semibold text-white">Idempotent Credit</p>
              <p className="text-[10px] text-slate-400">HTTP 409 guard + Confetti</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-blue-950/20 via-slate-900 to-indigo-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Cross-Border Currency Bridge (₹83 = $1 USD)
              </h4>
              <p className="text-xs text-slate-300">
                Charges international backers in USD ($1.20) via PayPal Sandbox while keeping the student recipient’s platform ledger strictly in integer INR paise.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold shrink-0">
              Zero Rounding Loss
            </span>
          </div>
        </div>
      ),
    },

    // Slide 7: Tech Stack
    {
      badge: 'Production Engineering',
      title: 'Modern, Scalable Technology Stack',
      subtitle: 'Engineered for speed, developer ergonomics, and rock-solid reliability.',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-white">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-xs font-bold text-white">Next.js 16</p>
            <p className="text-[10px] text-slate-400">Turbopack & App Router</p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-white">
              <Code className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-xs font-bold text-white">React 19</p>
            <p className="text-[10px] text-slate-400">Client Hydration Guards</p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-white">
              <Bot className="w-5 h-5 text-violet-400" />
            </div>
            <p className="text-xs font-bold text-white">Gemini 2.5</p>
            <p className="text-[10px] text-slate-400">Multimodal Flash API</p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs font-bold text-white">PayPal REST</p>
            <p className="text-[10px] text-slate-400">Orders v2 & Capture</p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-white">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-xs font-bold text-white">Tailwind v4</p>
            <p className="text-[10px] text-slate-400">Modern CSS Engine</p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-white">
              <Cpu className="w-5 h-5 text-pink-400" />
            </div>
            <p className="text-xs font-bold text-white">Playwright</p>
            <p className="text-[10px] text-slate-400">Automated E2E Testing</p>
          </div>
        </div>
      ),
    },

    // Slide 8: The Vision
    {
      badge: 'Looking Ahead',
      title: 'The Future of Student Builder Finances',
      subtitle: 'From campus group trips to institutional venture micro-grants.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-6 rounded-3xl border border-blue-500/20 bg-slate-900/60 space-y-3">
            <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 w-fit">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Campus Micro-Grants</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Partnering with university E-Cells, incubation centres, and makerspaces to disburse institutional alumni grants directly into verified milestones.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-indigo-500/20 bg-slate-900/60 space-y-3">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 w-fit">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Domestic UPI + Global Rails</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pairing domestic instant UPI auto-debit settlements with international PayPal backing for overseas diaspora alumni.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-emerald-500/20 bg-slate-900/60 space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 w-fit">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Verified Builder Graph</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Turning milestone execution records into verifiable builder portfolios for venture capital scout talent pipelines.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      {/* Top Header / Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
            Pitch Deck Presentation
          </span>
        </div>

        {/* Slide Counter & Indicators */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-slate-400 font-bold">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>

      {/* Slide Body */}
      <div className="max-w-5xl mx-auto w-full my-auto py-8 z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {slide.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            {slide.subtitle}
          </p>
        </div>

        <div className="mt-8 transition-all duration-300">
          {slide.content}
        </div>
      </div>

      {/* Bottom Footer Controls */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 z-10">
        <div className="text-slate-500 text-xs hidden sm:block">
          Use <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]">→</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]">Space</kbd> to navigate
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentSlide === 0
                ? 'opacity-30 cursor-not-allowed bg-slate-900 text-slate-600'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentSlide === slides.length - 1 ? (
            <Link
              href="/dashboard"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>Launch Live App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Decorative ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}

