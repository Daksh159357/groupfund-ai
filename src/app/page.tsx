'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion';
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
  Users,
  Wallet,
  Play,
  Coins,
  ArrowUpRight,
  Send,
  MessageSquare,
  Check,
  Zap,
} from 'lucide-react';
import { formatPaise } from '@/lib/financial';
import { INITIAL_PROJECTS } from '@/lib/store';

// Typewriter text generator for realistic conversational AI demo
function TypewriterText({ text, delay = 0, speed = 28 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const start = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, speed);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, delay, speed]);

  return <span>{displayed}</span>;
}

// Counting number animation for split cards
function CountUpNumber({ end, duration = 1.2 }: { end: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);

  return (
    <motion.span
      onViewportEnter={() => {
        if (!started) {
          setStarted(true);
          let current = 0;
          const steps = 35;
          const increment = Math.ceil(end / steps);
          const stepTime = Math.floor((duration * 1000) / steps);
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setVal(end);
              clearInterval(timer);
            } else {
              setVal(current);
            }
          }, stepTime);
        }
      }}
      viewport={{ once: true }}
    >
      ₹{val.toLocaleString('en-IN')}
    </motion.span>
  );
}

// 4-Directional Flying Scroll Variants for The GroupFund Advantage
const advantageVariants = {
  topLeft: {
    initial: { opacity: 0, x: -600, rotate: -15 },
    animate: { opacity: 1, x: 0, rotate: 0 },
  },
  topRight: {
    initial: { opacity: 0, x: 600, rotate: 15 },
    animate: { opacity: 1, x: 0, rotate: 0 },
  },
  bottomLeft: {
    initial: { opacity: 0, y: -600, rotate: -10 },
    animate: { opacity: 1, y: 0, rotate: 0 },
  },
  bottomRight: {
    initial: { opacity: 0, y: 600, rotate: 10 },
    animate: { opacity: 1, y: 0, rotate: 0 },
  },
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Mouse-Following Gradient Coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Sticky 220vh Container Scroll Tracking - Zero blank space, smooth pacing
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stickyProgress } = useScroll({
    target: stickyRef,
    offset: ['start start', 'end end'],
  });

  // Sticky Phase 1 (0.0 to 0.3): Scale from 0.88 to 1.0, rotateX 15deg to 0deg (starts visible, zero blank delay)
  const mockupScale = useTransform(stickyProgress, [0, 0.22], [0.88, 1.0]);
  const mockupRotateX = useTransform(stickyProgress, [0, 0.22], [15, 0]);
  const mockupOpacity = useTransform(stickyProgress, [0, 0.65, 0.74], [1, 1, 0]);
  const phase1Opacity = useTransform(stickyProgress, [0, 0.24, 0.30], [1, 1, 0]);

  // Sticky Phase 2 (0.3 to 0.65): Dashboard slides left, AI chat slides from right
  const mockupX = useTransform(stickyProgress, [0.28, 0.46], ['0%', '-24%']);
  const aiChatX = useTransform(stickyProgress, [0.28, 0.46], ['110%', '0%']);
  const aiChatOpacity = useTransform(stickyProgress, [0.28, 0.36, 0.62, 0.68], [0, 1, 1, 0]);
  const phase2Opacity = useTransform(stickyProgress, [0.28, 0.34, 0.62, 0.68], [0, 1, 1, 0]);

  // Sticky Phase 3 (0.68 to 1.0): Seamless Logo glow reveal in center
  const logoScale = useTransform(stickyProgress, [0.68, 0.88], [0.8, 1.05]);
  const logoOpacity = useTransform(stickyProgress, [0.68, 0.76, 1.0], [0, 1, 1]);
  const phase3Opacity = useTransform(stickyProgress, [0.68, 0.76, 1.0], [0, 1, 1]);

  // Scroll-Triggered Expense Splitting Section Tracking
  const splitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: splitProgress } = useScroll({
    target: splitRef,
    offset: ['start end', 'center center'],
  });

  const billY = useTransform(splitProgress, [0, 0.7], [20, -30]);
  const billOpacity = useTransform(splitProgress, [0, 0.4, 0.85], [1, 1, 0.35]);
  const membersY = useTransform(splitProgress, [0.25, 0.75], [50, 0]);
  const membersOpacity = useTransform(splitProgress, [0.25, 0.6], [0, 1]);
  const pathProgress = useTransform(splitProgress, [0.25, 0.75], [0, 1]);

  // Footer Orb Expansion Tracking
  const footerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: footerProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });
  const orbScale = useTransform(footerProgress, [0, 1], [0.6, 2.0]);
  const orbOpacity = useTransform(footerProgress, [0, 0.5, 1], [0.2, 0.65, 0.9]);

  const heroWords = ['Money', 'Management', 'Meets', 'Innovation', 'Funding.'];

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
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-x-hidden"
    >
      {/* Dynamic Mouse-Following Radial Gradient */}
      <motion.div
        className="pointer-events-none fixed -inset-px z-30 opacity-40 transition-opacity duration-300 hidden md:block"
        style={{
          background: useTransform(
            [smoothMouseX, smoothMouseY],
            ([x, y]) =>
              `radial-gradient(600px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
          ),
        }}
      />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                GroupFund <span className="text-blue-500 font-extrabold">AI</span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#expenses" className="hover:text-blue-400 transition-colors">Group Expenses</a>
            <a href="#advantage" className="hover:text-blue-400 transition-colors">Advantage</a>
            <a href="#projects" className="hover:text-blue-400 transition-colors">Innovation Funding</a>
            <a href="#ai" className="hover:text-blue-400 transition-colors">AI Features</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
            <Link href="/slides" className="text-purple-400 hover:text-purple-300 transition-colors">Pitch Deck</Link>
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

      {/* 1. Cinematic Hero Entrance with Floating Elements & Text Reveal */}
      <section className="relative pt-16 sm:pt-28 pb-20 px-4 sm:px-8 overflow-hidden">
        {/* Glow ambient gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-violet-600/10 blur-[130px] pointer-events-none" />

        {/* Floating Background Icons & Currency Symbols */}
        <motion.div
          animate={{ y: [0, -22, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="absolute top-24 left-[10%] hidden md:flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 backdrop-blur-md shadow-xl"
        >
          <span className="font-mono text-xl font-bold">₹</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -28, 0] }}
          transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-36 right-[12%] hidden md:flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 backdrop-blur-md shadow-xl"
        >
          <Receipt className="w-6 h-6" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-20 left-[15%] hidden md:flex items-center justify-center w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 backdrop-blur-md shadow-xl"
        >
          <Bot className="w-5 h-5" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -24, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.8 }}
          className="absolute bottom-28 right-[16%] hidden md:flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-md shadow-xl"
        >
          <ShieldCheck className="w-6 h-6" />
        </motion.div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Financial Collaboration Platform</span>
          </div>

          {/* Staggered Word Reveal Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white flex flex-wrap justify-center gap-x-3.5 gap-y-1">
            {heroWords.map((word, index) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.55, ease: 'easeOut' }}
                className={
                  index >= 3
                    ? 'bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent'
                    : ''
                }
              >
                {word}
              </motion.span>
            ))}
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

          {/* Quick Dual Pill Stats */}
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

      {/* 2. Apple-Style Sticky Scroll Container (220vh): "The Intelligence Behind Your Money" */}
      <section ref={stickyRef} className="relative h-[220vh] bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-slate-800/80">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-4">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-indigo-500/5 to-transparent dark:from-blue-600/15 dark:via-indigo-600/10 dark:to-transparent pointer-events-none" />

          {/* Phase 1 Text Overlay */}
          <motion.div
            style={{ opacity: phase1Opacity }}
            className="absolute top-20 sm:top-24 left-0 right-0 text-center z-20 pointer-events-none px-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 1 &bull; Track Every Rupee</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              The Intelligence Behind Your Money
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Real-time ledger tracking group balances, trip settlements, and student innovation backing.
            </p>
          </motion.div>

          {/* Phase 2 Text Overlay */}
          <motion.div
            style={{ opacity: phase2Opacity }}
            className="absolute top-20 sm:top-24 left-0 right-0 text-center z-20 pointer-events-none px-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
              <Bot className="w-3.5 h-3.5" />
              <span>Phase 2 &bull; Let AI Do The Math</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Autonomous Gemini 2.5 Financial Copilot
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Extract line items from crumpled bills, resolve splits, and draft full grant proposals automatically.
            </p>
          </motion.div>

          {/* Phase 3 Text Overlay */}
          <motion.div
            style={{ opacity: phase3Opacity }}
            className="absolute top-20 sm:top-24 left-0 right-0 text-center z-20 pointer-events-none px-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Phase 3 &bull; Fund The Future</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Server-Verified PayPal Sandbox Backing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Instant milestone disbursement, cross-border currency bridging, and zero rounding errors.
            </p>
          </motion.div>

          {/* Center Visual Staging Area */}
          <div className="relative w-full max-w-5xl h-[460px] sm:h-[500px] flex items-center justify-center mt-12 sm:mt-16">
            {/* 3D Dashboard Mockup */}
            <motion.div
              style={{
                scale: mockupScale,
                rotateX: mockupRotateX,
                x: mockupX,
                opacity: mockupOpacity,
                perspective: '1200px',
              }}
              className="w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-7 shadow-2xl shadow-blue-500/10 backdrop-blur-xl z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400 ml-2 font-mono">groupfund-ai.onrender.com/dashboard</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Ledger
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Group Balance</span>
                  <p className="text-xl font-bold text-slate-900 dark:text-white font-mono">+₹10,000</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Receivable from Goa Trip</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Active Groups</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Goa 2026 &bull; Robolab</p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Min-Cash-Flow Active</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Innovation Prototype</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">AgriBot Precision Rover</p>
                  <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">PayPal Verified &bull; 70%</p>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Live Settlement Ledger:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  0 Floating Errors (Exact Integer Paise Math)
                </span>
              </div>
            </motion.div>

            {/* Glowing AI Chat Box Sliding in from Right in Phase 2 */}
            <motion.div
              style={{
                x: aiChatX,
                opacity: aiChatOpacity,
              }}
              className="absolute right-0 sm:right-4 w-80 sm:w-96 rounded-3xl border border-indigo-200 dark:border-indigo-500/40 bg-white dark:bg-slate-900/95 p-5 shadow-2xl shadow-indigo-500/20 backdrop-blur-2xl z-20 space-y-3"
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 pb-2 border-b border-slate-200 dark:border-slate-800">
                <Bot className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">Gemini Financial Assistant</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200">
                  &ldquo;Scan dinner bill of ₹3,000 for Candolim Villa and split 3 ways.&rdquo;
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 text-indigo-900 dark:text-indigo-200">
                  &ldquo;Done! Split ₹1,000 each to Daksh, Rahul, and Jay. Min-Cash-Flow plan updated with 1 transfer.&rdquo;
                </div>
              </div>
            </motion.div>

            {/* Glowing GroupFund AI Emblem Revealed in Phase 3 */}
            <motion.div
              style={{
                scale: logoScale,
                opacity: logoOpacity,
              }}
              className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-2xl shadow-blue-500/50 border border-white/20">
                <Sparkles className="w-14 h-14 sm:w-16 sm:h-16" />
              </div>
              <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-6 tracking-tight">
                GroupFund <span className="text-blue-500">AI</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium">
                The Single Platform for Campus Finance & Prototype Grants
              </p>
              <a
                href="/dashboard"
                className="mt-5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 pointer-events-auto transition-transform active:scale-95"
              >
                Launch Live Dashboard &rarr;
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Scroll-Triggered Expense Splitting (The Core Visual) */}
      <section ref={splitRef} className="py-28 px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Interactive Mathematics
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Splitting bills has never been this beautiful.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Watch an unorganized ₹3,000 restaurant bill split cleanly across members with zero friction.
            </p>
          </div>

          <div className="relative pt-6 pb-12 flex flex-col items-center">
            {/* Single Glowing Center Bill Card */}
            <motion.div
              style={{ y: billY, opacity: billOpacity }}
              className="w-72 sm:w-80 rounded-3xl border border-blue-200 dark:border-blue-500/40 bg-white dark:bg-slate-900 p-5 shadow-2xl shadow-blue-500/10 text-left space-y-2 z-20"
            >
              <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400">
                <span className="font-semibold">Candolim Shack Dinner</span>
                <Receipt className="w-4 h-4" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                ₹3,000.00
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Paid by Daksh</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Receipt OCR Verified</span>
              </div>
            </motion.div>

            {/* SVG Dynamic Connecting Lines */}
            <div className="w-full max-w-md h-20 my-2 hidden md:block">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 80" fill="none">
                {/* Center to Left */}
                <motion.path
                  d="M 200 0 C 200 40, 60 40, 60 80"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  style={{ pathLength: pathProgress }}
                />
                {/* Center Straight Down */}
                <motion.path
                  d="M 200 0 L 200 80"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  style={{ pathLength: pathProgress }}
                />
                {/* Center to Right */}
                <motion.path
                  d="M 200 0 C 200 40, 340 40, 340 80"
                  stroke="#8b5cf6"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  style={{ pathLength: pathProgress }}
                />
              </svg>
            </div>

            {/* 3 Member Cards Fading & Counting In */}
            <motion.div
              style={{ y: membersY, opacity: membersOpacity }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-4 z-10"
            >
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-black/40 text-left space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                    D
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200">Daksh Sharma</span>
                </div>
                <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                  <CountUpNumber end={1000} />
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Personal Share</span>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-black/40 text-left space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                    R
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200">Rahul Verma</span>
                </div>
                <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1">
                  <CountUpNumber end={1000} />
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Owes Daksh</span>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-black/40 text-left space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                    J
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200">Jay Patel</span>
                </div>
                <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-1">
                  <CountUpNumber end={1000} />
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Owes Daksh</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. AI Intelligence Animation: "Meet your AI Financial Copilot" */}
      <section id="ai" className="py-24 px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Intelligence Layer
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Meet your AI Financial Copilot.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Powered by Google Gemini 2.5 Flash for natural multimodal bill extraction and automated project proposals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Glowing Chat Interface with Typewriter Effect */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-indigo-200 dark:border-indigo-500/30 bg-slate-50 dark:bg-slate-900/90 p-5 sm:p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Gemini 2.5 Assistant</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Multimodal OCR & Debt Planner</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-mono font-semibold">
                  Online
                </span>
              </div>

              {/* Chat Thread */}
              <div className="space-y-3 py-2">
                {/* User Bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2.5 text-xs text-white shadow-md">
                    <TypewriterText text="Scan this receipt and split it between 5 people." delay={300} speed={25} />
                  </div>
                </div>

                {/* Gemini AI Bubble */}
                <div className="flex justify-start items-start gap-2 pt-1">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-600/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/40 px-4 py-2.5 text-xs text-indigo-900 dark:text-indigo-100 shadow-md space-y-1.5">
                    <p className="font-semibold text-indigo-950 dark:text-indigo-300">
                      <TypewriterText
                        text="Done! Extracted 4 items totaling ₹2,500. Everyone owes exactly ₹500."
                        delay={1600}
                        speed={25}
                      />
                    </p>
                    <div className="text-[10px] text-indigo-700/80 dark:text-indigo-300/80 pt-1 border-t border-indigo-200 dark:border-indigo-500/20 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Zero remainder rounding errors. Added to College Trip ledger.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fake Input Box */}
              <div className="pt-2">
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <input
                    type="text"
                    disabled
                    placeholder="Ask Gemini to analyze debts or draft proposal..."
                    className="w-full bg-transparent text-xs text-slate-600 dark:text-slate-400 px-2 outline-none"
                  />
                  <button className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right: AI Capability Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.04, rotateY: 4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
              >
                <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Unified Assistant</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ask &ldquo;Who owes me money?&rdquo; or &ldquo;How much did I spend in Goa?&rdquo; anytime.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04, rotateY: 4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 cursor-pointer shadow-sm hover:border-indigo-400 transition-colors"
              >
                <Receipt className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Multimodal Receipt OCR</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Accepts camera photos of invoices and extracts line items, subtotal, and taxes.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04, rotateY: 4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 cursor-pointer shadow-sm hover:border-amber-400 transition-colors"
              >
                <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Proposal Drafter</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Converts rough robotics hardware concepts into BOM budgets and milestone schedules.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04, rotateY: 4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 cursor-pointer shadow-sm hover:border-emerald-400 transition-colors"
              >
                <Cpu className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Milestone Verification</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Audits sensor logs, test documents, and photos to score milestone completion.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The GroupFund Advantage: 4-Directional Flying Scroll Animation */}
      <section id="advantage" className="relative w-full overflow-hidden py-24 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 space-y-14 relative z-10">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The GroupFund Advantage</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built Different for Real Campus Life.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Why student engineering teams, roommates, and innovators choose our unified AI ledger over disconnected spreadsheets and payment apps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1 (Top Left): Flies in from far left with -15deg tilt */}
            <motion.div
              variants={advantageVariants.topLeft}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              transition={{ type: 'spring', stiffness: 70, damping: 13, mass: 0.9 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl p-7 sm:p-8 space-y-5 shadow-xl shadow-slate-200/50 dark:shadow-black/30 hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
                    <Coins className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 uppercase tracking-wider">
                    Zero Rounding Loss
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Exact Integer Paise Math
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Standard finance apps use IEEE 754 floating-point numbers, creating ₹1 remainder anomalies when splitting bills 3 ways. GroupFund stores every rupee strictly in integer paise, guaranteeing zero lost funds down to the cent.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">0.00% Floating Drift</span>
                <span>Audit-Verified Ledger</span>
              </div>
            </motion.div>

            {/* Card 2 (Top Right): Flies in from far right with +15deg tilt */}
            <motion.div
              variants={advantageVariants.topRight}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              transition={{ type: 'spring', stiffness: 70, damping: 13, mass: 0.9 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl p-7 sm:p-8 space-y-5 shadow-xl shadow-slate-200/50 dark:shadow-black/30 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10">
                    <Bot className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                    Multimodal Vision
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Gemini 2.5 Multimodal Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Snap photo of any crumpled dinner receipt, electronics BOM invoice, or trip ticket. Google Gemini 2.5 Flash extracts line items, verifies tax rates, and drafts full grant proposals automatically without tedious typing.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">Sub-Second OCR</span>
                <span>Automated Itemization</span>
              </div>
            </motion.div>

            {/* Card 3 (Bottom Left): Drops down from the top with -10deg tilt */}
            <motion.div
              variants={advantageVariants.bottomLeft}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              transition={{ type: 'spring', stiffness: 70, damping: 13, mass: 0.9 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl p-7 sm:p-8 space-y-5 shadow-xl shadow-slate-200/50 dark:shadow-black/30 hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-sky-500/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10">
                    <Split className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 uppercase tracking-wider">
                    Graph Simplification
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Min-Cash-Flow Net Debt Resolution
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Instead of 12 messy back-and-forth payments between friends, our greedy graph algorithm calculates net consumption shares and reduces them to the absolute minimum transfers needed to zero everyone out.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">O(V log V) Graph Solver</span>
                <span>Minimal Friction</span>
              </div>
            </motion.div>

            {/* Card 4 (Bottom Right): Flies up from bottom with +10deg tilt */}
            <motion.div
              variants={advantageVariants.bottomRight}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              transition={{ type: 'spring', stiffness: 70, damping: 13, mass: 0.9 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl p-7 sm:p-8 space-y-5 shadow-xl shadow-slate-200/50 dark:shadow-black/30 hover:border-amber-400 dark:hover:border-amber-500/50 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/10">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                    PayPal REST Orders v2
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Server-Verified PayPal Crowdfunding
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Support innovative student hardware projects worldwide. Every contribution uses server-side order creation and webhook verification, bridging international USD backers to Indian INR student innovators seamlessly.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">USD/INR Bridge ($1.20 = ₹100)</span>
                <span>Milestone-Locked Payouts</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Discover Innovation Projects */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="py-20 px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Module B &bull; Innovation Crowdfunding
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-1">
                Featured Engineering & Robotics Innovations
              </h2>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500"
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
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden flex flex-col justify-between group hover:border-blue-400 dark:hover:border-slate-700 transition-all shadow-md shadow-slate-200/50 dark:shadow-xl dark:shadow-black/20"
                >
                  <div>
                    <div className="h-44 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={proj.images[0] || '/images/aeroclean.jpg'}
                        alt={proj.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/aeroclean.jpg';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-white">
                        {proj.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{proj.institution}</p>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">{proj.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {proj.shortDescription}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-900 dark:text-white">{formatPaise(proj.raisedAmountPaise)}</span>
                          <span className="text-slate-500 dark:text-slate-400">{progressPct}% of {formatPaise(proj.targetAmountPaise)}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
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
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
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
      </motion.section>

      {/* 6. PayPal Developer Sandbox Checkout Card */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="py-20 px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800/80"
      >
        <div className="max-w-4xl mx-auto rounded-3xl border border-blue-200 dark:border-blue-500/30 bg-white dark:bg-gradient-to-b dark:from-blue-950/20 dark:to-slate-900 shadow-xl shadow-blue-500/5 p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-4 h-4" />
            <span>PayPal Developer Sandbox Checkout</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Secure, Server-Verified Contributions
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Every contribution creates a PayPal order server-side, captures it with PayPal API credentials, and verifies webhooks before updating project funding progress.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shadow-sm">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Step 1</span>
              <p className="font-semibold text-xs text-slate-900 dark:text-white mt-1">Select Backing Tier</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Pick preset INR amount or custom backing.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shadow-sm">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Step 2</span>
              <p className="font-semibold text-xs text-slate-900 dark:text-white mt-1">PayPal Sandbox</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Complete sandbox checkout with test balance.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shadow-sm">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Step 3</span>
              <p className="font-semibold text-xs text-slate-900 dark:text-white mt-1">Instant Milestone Fund</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Audit log recorded & project gets funded!</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 7. Frequently Asked Questions */}
      <motion.section
        id="faq"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="py-20 px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800/80"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Everything you need to know about GroupFund AI</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 8. Cinematic Footer Transition with Expanding Glowing Orb */}
      <section ref={footerRef} className="relative py-28 px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {/* Expanding Glowing Orb */}
        <motion.div
          style={{ scale: orbScale, opacity: orbOpacity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-violet-500/20 dark:from-blue-600/30 dark:via-indigo-600/30 dark:to-violet-600/30 blur-[100px] pointer-events-none"
        />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 mx-auto flex items-center justify-center text-white shadow-2xl shadow-blue-500/40"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to organize group money & fund great ideas?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Join students and innovators managing expenses with mathematical precision and crowdfunding prototypes with PayPal.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition-all active:scale-[0.98]"
            >
              Open Live Dashboard
            </Link>
            <Link
              href="/slides"
              className="px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-200 font-semibold text-sm transition-all active:scale-[0.98] shadow-sm"
            >
              View In-App Pitch Deck
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Final Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
              GF
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-300">GroupFund AI</span>
            <span>&bull; Hackathon Edition 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-slate-300 transition-colors">Dashboard</Link>
            <Link href="/discover" className="hover:text-blue-600 dark:hover:text-slate-300 transition-colors">Discover</Link>
            <Link href="/expenses" className="hover:text-blue-600 dark:hover:text-slate-300 transition-colors">Expenses</Link>
            <Link href="/ai-assistant" className="hover:text-blue-600 dark:hover:text-slate-300 transition-colors">AI Assistant</Link>
            <Link href="/slides" className="hover:text-blue-600 dark:hover:text-slate-300 transition-colors">Slides</Link>
          </div>

          <div>
            Built with Next.js, Supabase, Google Gemini & PayPal Sandbox.
          </div>
        </div>
      </footer>
    </div>
  );
}
