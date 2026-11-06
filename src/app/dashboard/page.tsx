'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { formatPaise } from '@/lib/financial';
import {
  Users,
  Receipt,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Sparkles,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Upload,
} from 'lucide-react';
import { CreateExpenseModal } from '@/components/expenses/CreateExpenseModal';
import { CreateGroupModal } from '@/components/groups/CreateGroupModal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const { currentUser, groups, expenses, projects, settlements, getUserBalanceSummary } = useApp();
  const [isMounted, setIsMounted] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const balanceSummary = getUserBalanceSummary();

  // Innovation funding stats
  const totalRaisedAcrossProjects = projects.reduce((acc, p) => acc + p.raisedAmountPaise, 0);
  const myProjects = projects.filter((p) => p.creatorId === currentUser.id);

  // Category breakdown chart data
  const categoryMap: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amountPaise;
  });

  const categoryData = Object.entries(categoryMap).map(([name, paise]) => ({
    name,
    amount: paise / 100,
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

  if (!isMounted) {
    return (
      <AppLayout>
        <div className="space-y-8 animate-pulse">
          {/* Top Welcome Banner Skeleton */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 h-40 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-4 w-44 bg-slate-800 rounded-full" />
              <div className="h-8 w-64 sm:w-80 bg-slate-800 rounded-xl" />
              <div className="h-4 w-72 sm:w-96 bg-slate-800/60 rounded" />
            </div>
          </div>

          {/* 4 Metric Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-28 bg-slate-800 rounded" />
                  <div className="w-8 h-8 rounded-xl bg-slate-800" />
                </div>
                <div className="h-7 w-32 bg-slate-800 rounded-lg" />
                <div className="h-3 w-40 bg-slate-800/60 rounded" />
              </div>
            ))}
          </div>

          {/* Two-Column Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 h-64" />
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 h-72" />
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 h-80" />
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 h-40" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Top Welcome Banner */}
        <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 p-6 sm:p-8 overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Unified Financial Intelligence</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome back, {currentUser.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                You are participating in {groups.length} groups and leading {myProjects.length} innovation prototype initiatives.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowAddExpense(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                <Receipt className="w-4 h-4" />
                <span>+ Add Expense</span>
              </button>

              <Link
                href="/projects/create"
                className="px-4 py-2.5 rounded-xl border border-violet-500/40 bg-violet-950/40 hover:bg-violet-900/50 text-violet-300 font-semibold text-xs flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                <Lightbulb className="w-4 h-4 text-violet-400" />
                <span>+ Fund Project</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Unified Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Net Group Balance */}
          <div id="tour-group-balance" className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Net Group Balance</span>
              <div
                className={`p-2 rounded-xl ${
                  balanceSummary.netPaise >= 0
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}
              >
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-3 font-mono">
              {balanceSummary.netPaise > 0 ? '+' : ''}
              {formatPaise(balanceSummary.netPaise)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {balanceSummary.netPaise >= 0 ? (
                <span className="text-emerald-400 font-medium">You are owed by friends</span>
              ) : (
                <span className="text-amber-400 font-medium">You have pending payables</span>
              )}
            </p>
          </div>

          {/* Card 2: Total Spent Out of Pocket */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Group Outlay</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-3 font-mono">
              {formatPaise(balanceSummary.totalPaidPaise)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Your personal share: <span className="text-slate-200">{formatPaise(balanceSummary.totalSharePaise)}</span>
            </p>
          </div>

          {/* Card 3: Active Groups */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active Groups</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-3">{groups.length}</p>
            <p className="text-xs text-slate-400 mt-1">
              <Link href="/groups" className="text-blue-400 hover:underline">
                View all groups &rarr;
              </Link>
            </p>
          </div>

          {/* Card 4: Total Crowdfunding Raised */}
          <div id="tour-total-raised" className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Innovation Funding</span>
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-3 font-mono">
              {formatPaise(totalRaisedAcrossProjects)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Across {projects.length} verified projects
            </p>
          </div>
        </div>

        {/* Two-Column Module Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Recent Group Expenses & Chart (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Expenses Container */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Recent Group Expenses</h3>
                  <p className="text-xs text-slate-400">Latest shared transactions across your circles</p>
                </div>
                <Link
                  href="/expenses"
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  <span>All expenses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-800/80">
                {expenses.slice(0, 5).map((exp) => (
                  <div key={exp.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-slate-300 text-xs font-bold">
                        {exp.category[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{exp.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {exp.groupName} &bull; Paid by <span className="text-slate-300">{exp.paidByUserName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono text-xs font-bold text-white">
                        {formatPaise(exp.amountPaise)}
                      </p>
                      <span className="text-[10px] text-slate-400 capitalize">{exp.splitType} split</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expenditure Chart */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Expenditure by Category</h3>
                <p className="text-xs text-slate-400">Breakdown of total shared group spending</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip
                      formatter={(val: any) => [`₹${val}`, 'Spent']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: Innovation Projects Spotlight & Settlements (1/3) */}
          <div className="space-y-6">
            {/* Innovation Showcase */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Innovation Projects</h3>
                  <p className="text-xs text-slate-400">Student prototypes seeking backing</p>
                </div>
                <Link href="/discover" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
                  Discover
                </Link>
              </div>

              <div className="space-y-4">
                {projects.slice(0, 2).map((proj) => {
                  const progress = Math.min(100, Math.round((proj.raisedAmountPaise / proj.targetAmountPaise) * 100));
                  return (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl border border-slate-800 bg-slate-950/50 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={proj.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">{proj.title}</p>
                          <p className="text-[10px] text-blue-400">{proj.institution}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-semibold text-white">{formatPaise(proj.raisedAmountPaise)}</span>
                          <span className="text-slate-400">{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <Link
                        href={`/projects/${proj.id}`}
                        className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Contribute</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Assistant Quick Card */}
            <div className="p-6 rounded-3xl border border-blue-500/25 bg-gradient-to-b from-blue-950/30 to-slate-900/80 space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">Ask GroupFund AI</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Got questions about who owes you money or need help drafting a grant proposal for your next robotics project?
              </p>
              <Link
                href="/ai-assistant"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                <span>Launch Assistant &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showAddExpense && <CreateExpenseModal onClose={() => setShowAddExpense(false)} />}
      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
    </AppLayout>
  );
}
