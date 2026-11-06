'use client';

import React, { useState, useEffect } from 'react';
import { Joyride, EventData, STATUS, Step } from 'react-joyride';
import { Sparkles, Plane, Rocket, Bot, PlusCircle, Wallet } from 'lucide-react';

export function OnboardingTour() {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only run tour if not previously completed and on desktop/laptop screens where sidebar is visible
    if (typeof window !== 'undefined') {
      const tourCompleted = localStorage.getItem('groupfund_tour_completed');
      const isDesktop = window.innerWidth >= 1024;
      if (!tourCompleted && isDesktop) {
        // Delay to ensure all dynamic elements and cards are mounted and laid out
        const timer = setTimeout(() => {
          setRun(true);
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const steps: Step[] = [
    {
      target: '#tour-app-logo',
      title: 'Welcome to GroupFund AI 🚀',
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-indigo-400 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Gen Financial Intelligence</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Manage money together and fund great ideas. Here is a quick 30-second tour of what you can do.
          </p>
        </div>
      ),
      placement: 'bottom-start',
      skipBeacon: true,
    },
    {
      target: '#tour-group-balance',
      title: 'Split Trips & Group Expenses ✈️',
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs">
            <Plane className="w-3.5 h-3.5 text-blue-400" />
            <span>Exact Paise-Level Math</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Tired of calculating who owes what? Add trips, dinners, or hostel expenses. We split it exactly down to the paise.
          </p>
          <p className="mt-2 text-indigo-400 font-medium text-[11px] bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/20">
            Features: Receipt scanning, custom splits, instant settlements.
          </p>
        </div>
      ),
      placement: 'bottom',
      skipBeacon: true,
    },
    {
      target: '#tour-total-raised',
      title: 'Fund Student Innovation 🔬',
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-violet-400 font-semibold text-xs">
            <Rocket className="w-3.5 h-3.5 text-violet-400" />
            <span>Robotics & Prototype Grants</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Support robotics, AI, and engineering students. Or launch your own project to raise funds for your prototype.
          </p>
          <p className="mt-2 text-indigo-400 font-medium text-[11px] bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/20">
            Features: AI proposal generation, milestone tracking.
          </p>
        </div>
      ),
      placement: 'bottom',
      skipBeacon: true,
    },
    {
      target: '#tour-ai-assistant',
      title: 'Your AI Financial Copilot 🤖',
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-xs">
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>Autonomous Intelligence</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Stuck? Ask the AI to scan a receipt, draft a funding proposal, or explain your group balances.
          </p>
        </div>
      ),
      placement: 'right',
      skipBeacon: true,
    },
    {
      target: '#tour-new-group-btn',
      title: 'Create Your First Group',
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Onboarding</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Click here to start a new trip or event. Invite your friends with a link and start tracking!
          </p>
        </div>
      ),
      placement: 'right',
      skipBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: EventData) => {
    const { status, action } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED || action === 'close') {
      setRun(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('groupfund_tour_completed', 'true');
      }
    }
  };

  if (!mounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      onEvent={handleJoyrideCallback}
      options={{
        buttons: ['back', 'primary', 'skip'],
        overlayColor: 'rgba(2, 6, 23, 0.85)',
        primaryColor: '#4f46e5',
        textColor: '#f8fafc',
        zIndex: 100000,
        skipBeacon: true,
      }}
      styles={{
        tooltip: {
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          borderRadius: '1.25rem',
          border: '1px solid #1e293b',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          padding: '1.25rem',
          maxWidth: '380px',
        },
        tooltipTitle: {
          fontSize: '1rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '0.5rem',
        },
        tooltipContent: {
          fontSize: '0.825rem',
          lineHeight: '1.5',
          color: '#cbd5e1',
          padding: '0 0 1rem 0',
        },
        buttonPrimary: {
          backgroundColor: '#4f46e5',
          borderRadius: '0.75rem',
          color: '#ffffff',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '0.5rem 1rem',
          outline: 'none',
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.45)',
        },
        buttonBack: {
          color: '#94a3b8',
          fontSize: '0.75rem',
          marginRight: '0.6rem',
        },
        buttonSkip: {
          color: '#64748b',
          fontSize: '0.75rem',
        },
        buttonClose: {
          color: '#94a3b8',
        },
      }}
      locale={{
        last: 'Get Started',
        skip: 'Skip Tour',
        next: 'Next',
        back: 'Back',
      }}
    />
  );
}
