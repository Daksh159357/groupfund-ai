'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Receipt,
  Lightbulb,
  Split,
  Bot,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ChevronDown,
  Layers,
  HeartHandshake,
  ExternalLink,
} from 'lucide-react';
import { formatPaise } from '@/lib/financial';
import { INITIAL_PROJECTS } from '@/lib/store';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const faqs = [
    {
      q: 'How does GroupFund AI combine group expenses and innovation crowdfunding?',
      a: 'GroupFund AI is a single unified platform where your account manages both social group expenses (like college trips, lab bills, dinners) and innovation crowdfunding for student robotics and engineering teams. Both modules share the same wallet ledger, notifications, and AI assistant.',
    },
    {
      q: 'How does the AI Receipt Scanner work?',
      a: 'Using Google Gemini multimodal vision, you simply snap or upload a photo of any printed or digital bill. Gemini identifies the merchant, date, itemized line items, tax, and total. You always review and confirm the extracted data before saving.',
    },
    {
      q: 'How does the debt simplification settlement algorithm work?',
      a: 'Instead of having everyone transfer money to multiple people, our Min-Cash-Flow algorithm computes each person’s net balance and generates the absolute minimum number of peer-to-peer transfers to settle the entire group to zero.',
    },
    {
      q: 'How do payments work with PayPal Developer Sandbox?',
      a: 'Contributors can back student innovation projects using PayPal Sandbox. Payments are created, verified, and captured server-side with strict idempotency and audit logs, ensuring no unverified frontend claims are trusted.',
    },
    {
      q: 'Can students use Gemini AI to write funding proposals?',
      a: 'Yes! The built-in AI Project Assistant helps innovators formulate professional problem statements, calculate realistic prototype budgets, and structure phased milestone deliverables.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                GroupFund <span className="text-blue-500 font-extrabold">AI</span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#expenses" className="hover:text-blue-400 transition-colors">Group Expenses</a>
            <a href="#projects" className="hover:text-blue-400 transition-colors">Innovation Funding</a>
            <a href="#ai" className="hover:text-blue-400 transition-colors">AI Features</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
            <Link href="/discover" className="hover:text-blue-400 transition-colors">Discover Projects</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-8 overflow-hidden">
        {/* Glow ambient gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-violet-600/10 blur-[130px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Financial Collaboration Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
            Money Management Meets <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              Innovation Funding.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
            Split expenses with friends, track every transaction with paise-level precision, and help the next generation of robotics students and engineering teams turn prototypes into reality.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/35 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Start Managing Expenses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/discover"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Lightbulb className="w-4 h-4 text-violet-400" />
              <span>Explore Innovation Projects</span>
            </Link>
          </div>

          {/* Dual Pill Stats */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md text-left">
              <p className="text-[11px] text-slate-400 font-medium">Split Accuracy</p>
              <p className="text-xl font-bold text-white mt-0.5">1-Paise Exact</p>
              <p className="text-[10px] text-emerald-400 mt-1">Zero floating errors</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md text-left">
              <p className="text-[11px] text-slate-400 font-medium">Receipt Scanning</p>
              <p className="text-xl font-bold text-white mt-0.5">Gemini Vision</p>
              <p className="text-[10px] text-blue-400 mt-1">Itemized line items</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md text-left">
              <p className="text-[11px] text-slate-400 font-medium">Settlement Algorithm</p>
              <p className="text-xl font-bold text-white mt-0.5">Min-Cash-Flow</p>
              <p className="text-[10px] text-indigo-400 mt-1">Minimal transfers</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md text-left">
              <p className="text-[11px] text-slate-400 font-medium">Checkout Flow</p>
              <p className="text-xl font-bold text-white mt-0.5">PayPal Sandbox</p>
              <p className="text-[10px] text-purple-400 mt-1">Server verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How Group Expenses Work */}
      <section id="expenses" className="py-20 px-4 sm:px-8 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Module A &bull; Group Expenses
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Effortless Shared Money with Friends & Teams
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              From college trips in Goa to hostel groceries and robotics lab hardware components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. AI Receipt Scanning</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Snap any food, travel, or hardware receipt. Gemini automatically extracts merchant name, date, items, tax, and total for your approval before saving.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <Split className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Flexible 3-Way Splits</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Split equally, by exact percentages, or custom amounts. Integer paise math guarantees the sum of member shares equals the receipt to the penny.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Simplified Settlements</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our mathematically optimal settlement calculator slashes tangled group debts into the fewest transactions, with one-click payment recordings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Discover Innovation Projects */}
      <section id="projects" className="py-20 px-4 sm:px-8 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                Module B &bull; Innovation Crowdfunding
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1">
                Featured Engineering & Robotics Innovations
              </h2>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              <span>Explore all projects</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_PROJECTS.map((proj) => {
              const progressPct = Math.min(100, Math.round((proj.raisedAmountPaise / proj.targetAmountPaise) * 100));
              return (
                <div
                  key={proj.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="h-44 relative overflow-hidden bg-slate-800">
                      <img
                        src={proj.images[0]}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-white">
                        {proj.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-[11px] text-blue-400 font-medium">{proj.institution}</p>
                      <h3 className="font-bold text-base text-white line-clamp-1">{proj.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {proj.shortDescription}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-white">{formatPaise(proj.raisedAmountPaise)}</span>
                          <span className="text-slate-400">{progressPct}% of {formatPaise(proj.targetAmountPaise)}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={`/projects/${proj.id}`}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View Prototype & Back</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. AI-Powered Features (Gemini) */}
      <section id="ai" className="py-20 px-4 sm:px-8 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Intelligence Layer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Powered by Google Gemini 2.5 Flash
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Smart tools built directly into your workflow to save time, prevent debt disputes, and accelerate grants.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 space-y-3">
              <Bot className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold text-sm text-white">Unified Assistant</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ask &ldquo;Who owes me money?&rdquo;, &ldquo;How much did I spend?&rdquo;, or &ldquo;Help me write a robotics proposal&rdquo; anytime.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 space-y-3">
              <Receipt className="w-6 h-6 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">Multimodal Receipt OCR</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts taxes, discounts, and item breakdowns from paper invoices with high confidence scores.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 space-y-3">
              <Lightbulb className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-sm text-white">Proposal & Budget Drafter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Converts rough engineering concepts into polished problem statements, BOM budgets, and milestone schedules.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 space-y-3">
              <Cpu className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Milestone Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyzes submitted benchmark test reports and hardware evidence to output transparent risk ratings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How Funding Works with PayPal */}
      <section className="py-20 px-4 sm:px-8 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-slate-900 p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <ShieldCheck className="w-4 h-4" />
            <span>PayPal Developer Sandbox Checkout</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white">
            Secure, Server-Verified Contributions
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Every contribution creates a PayPal order server-side, captures it with PayPal API credentials, and verifies webhooks before updating project funding progress.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
              <span className="text-xs font-bold text-blue-400">Step 1</span>
              <p className="font-semibold text-xs text-white mt-1">Select Backing Tier</p>
              <p className="text-[11px] text-slate-400 mt-1">Pick preset INR amount or custom backing.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
              <span className="text-xs font-bold text-blue-400">Step 2</span>
              <p className="font-semibold text-xs text-white mt-1">PayPal Sandbox</p>
              <p className="text-[11px] text-slate-400 mt-1">Complete sandbox checkout with test balance.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
              <span className="text-xs font-bold text-blue-400">Step 3</span>
              <p className="font-semibold text-xs text-white mt-1">Instant Milestone Fund</p>
              <p className="text-[11px] text-slate-400 mt-1">Audit log recorded & project gets funded!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section id="faq" className="py-20 px-4 sm:px-8 border-t border-slate-800/80">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Everything you need to know about GroupFund AI</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:bg-slate-800/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
              GF
            </div>
            <span className="font-semibold text-slate-300">GroupFund AI</span>
            <span>&bull; Hackathon Edition 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
            <Link href="/discover" className="hover:text-slate-300 transition-colors">Discover</Link>
            <Link href="/expenses" className="hover:text-slate-300 transition-colors">Expenses</Link>
            <Link href="/ai-assistant" className="hover:text-slate-300 transition-colors">AI Assistant</Link>
          </div>

          <div>
            Built with Next.js, Supabase, Google Gemini & PayPal Sandbox.
          </div>
        </div>
      </footer>
    </div>
  );
}
