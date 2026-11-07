'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { formatPaise } from '@/lib/financial';
import { Scale, CheckCircle2, Clock, ArrowRight, Check, Sparkles } from 'lucide-react';
import { SettlementModal } from '@/components/settlements/SettlementModal';

export default function SettlementsPage() {
  const { settlements, groups, currentUser, markSettlementCompleted } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showModal, setShowModal] = useState(false);

  const filteredSettlements = settlements.filter((s) => {
    if (filter === 'pending') return s.status === 'pending';
    if (filter === 'completed') return s.status === 'completed';
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settlements Hub</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Clear outstanding group balances and record peer-to-peer transfers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
            >
              <Scale className="w-4 h-4" />
              <span>Record Settlement</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(['all', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab} Settlements
            </button>
          ))}
        </div>

        {/* Settlements List */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
          {filteredSettlements.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-500 dark:text-slate-400">
              No settlements found matching &ldquo;{filter}&rdquo;.
            </div>
          ) : (
            filteredSettlements.map((s) => (
              <div
                key={s.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      s.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {s.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {s.fromUserName} &rarr; {s.toUserName}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          s.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {s.groupName || 'Group Transfer'} &bull; Via {s.paymentMethod.toUpperCase()}{' '}
                      {s.transactionRef && `(Ref: ${s.transactionRef})`}
                    </p>
                    {s.notes && <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">&ldquo;{s.notes}&rdquo;</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                      {formatPaise(s.amountPaise)}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {s.status === 'pending' && (
                    <button
                      onClick={() => markSettlementCompleted(s.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1 border border-emerald-200 dark:border-transparent"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Received</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && groups[0] && (
        <SettlementModal
          groupId={groups[0].id}
          groupName={groups[0].name}
          members={groups[0].members}
          onClose={() => setShowModal(false)}
        />
      )}
    </AppLayout>
  );
}
