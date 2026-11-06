'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { formatPaise } from '@/lib/financial';
import {
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Search,
  Filter,
} from 'lucide-react';

export default function TransactionsPage() {
  const { transactions, currentUser } = useApp();
  const [filter, setFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((t) => {
    const matchesFilter = filter === 'all' || t.direction === filter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Payments & Transactions Ledger</h1>
            <p className="text-xs text-slate-400">
              Audit log of expense payments, settlements, and PayPal Sandbox innovation contributions
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(['all', 'debit', 'credit'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filter === tab
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab === 'all' ? 'All Transactions' : tab === 'debit' ? 'Debits (Paid Out)' : 'Credits (Received)'}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-500">
              No transactions match your search.
            </div>
          ) : (
            filtered.map((tx) => (
              <div
                key={tx.id}
                className="p-5 flex items-center justify-between gap-4 hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      tx.direction === 'credit'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tx.direction === 'credit' ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-white truncate">{tx.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(tx.createdAt).toLocaleString()} &bull; Type:{' '}
                      <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`font-mono font-bold text-sm ${
                      tx.direction === 'credit' ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {tx.direction === 'credit' ? '+' : '-'}
                    {formatPaise(tx.amountPaise)}
                  </p>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{tx.status}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
