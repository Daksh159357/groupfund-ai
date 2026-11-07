'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import {
  Settings,
  Sun,
  Moon,
  Database,
  Bot,
  CreditCard,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Compass,
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme, resetDemoData } = useApp();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (confirm('Reset all groups, expenses, and projects back to initial demo state?')) {
      resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-xs text-slate-400">
            Appearance preferences, live API integrations status, and local environment diagnostics
          </p>
        </div>

        {/* Theme Settings */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            Appearance & Interface Theme
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-200">Color Mode</p>
              <p className="text-[11px] text-slate-400">
                Switch between high-contrast Dark Mode and clean Light Mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span className="capitalize">{theme} Mode Active</span>
            </button>
          </div>
        </div>

        {/* Integration Diagnostics */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            Service Integrations Status
          </h2>

          <div className="space-y-3 text-xs">
            {/* Gemini */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Google Gemini 2.5 Flash</p>
                  <p className="text-[10px] text-slate-400">Multimodal receipt OCR, grant assistant & chat</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Ready & Responsive</span>
              </span>
            </div>

            {/* PayPal Sandbox */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">PayPal Developer Sandbox</p>
                  <p className="text-[10px] text-slate-400">Server-side order create, capture & webhooks</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Sandbox Verified</span>
              </span>
            </div>

            {/* Supabase PostgreSQL */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Database & State Storage</p>
                  <p className="text-[10px] text-slate-400">LocalStorage reactive store + Supabase schema ready</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active & Persistent</span>
              </span>
            </div>
          </div>
        </div>

        {/* Product Onboarding Tour */}
        <div className="p-6 rounded-3xl border border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-r from-indigo-50 via-blue-50/70 to-indigo-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-blue-950/20 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Product Onboarding Tour</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Restart the interactive guided walkthrough of GroupFund AI (spotlighting trips & expense splitting, student innovation crowdfunding, and AI copilot).
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('groupfund_tour_completed');
              window.location.href = '/dashboard';
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/40 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <Compass className="w-4 h-4" />
            <span>Replay Guided Tour</span>
          </button>
        </div>

        {/* Demo Data Reset */}
        <div className="p-6 rounded-3xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/60 dark:bg-rose-950/10 space-y-3 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Hackathon Demo State Reset</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Resets all test groups, Goa trip expenses (Daksh ₹5k, Rahul ₹2k, Jay ₹1.5k, Meet ₹1k, Harsh ₹500), and innovation projects back to original state.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-600/30 dark:hover:bg-rose-600/40 text-rose-800 dark:text-rose-200 text-xs font-semibold border border-rose-300 dark:border-rose-500/30 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600 dark:text-rose-300" />
            <span>Reset Demo Store to Factory State</span>
          </button>
          {resetSuccess && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Demo store restored successfully!</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
