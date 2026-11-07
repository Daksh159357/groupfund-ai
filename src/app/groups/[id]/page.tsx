'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import {
  calculateGroupBalances,
  calculateSimplifiedSettlements,
  formatPaise,
} from '@/lib/financial';
import {
  Users,
  Receipt,
  PlusCircle,
  Copy,
  Check,
  Scale,
  ArrowRight,
  Sparkles,
  Share2,
  Trash2,
  BellRing,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { CreateExpenseModal } from '@/components/expenses/CreateExpenseModal';
import { SettlementModal } from '@/components/settlements/SettlementModal';

function GroupDetailContent() {
  const routeParams = useParams();
  const id = (routeParams?.id as string) || '';
  const { groups, expenses, settlements, currentUser, isHydrated, deleteExpense, markSettlementCompleted } = useApp();

  const [activeTab, setActiveTab] = useState<'expenses' | 'balances' | 'settlements' | 'members'>('expenses');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [settleRecipientId, setSettleRecipientId] = useState<string | undefined>(undefined);
  const [settleAmountPaise, setSettleAmountPaise] = useState<number | undefined>(undefined);
  const [copiedLink, setCopiedLink] = useState(false);
  const [reminderSent, setReminderSent] = useState<string | null>(null);

  // If store is still hydrating from localStorage, show loading skeleton
  if (!isHydrated) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-44 rounded-3xl bg-slate-900 border border-slate-800" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="h-20 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-20 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-20 rounded-2xl bg-slate-900 border border-slate-800" />
            <div className="h-20 rounded-2xl bg-slate-900 border border-slate-800" />
          </div>
          <div className="h-64 rounded-2xl bg-slate-900 border border-slate-800" />
        </div>
      </AppLayout>
    );
  }

  // Find group by either group.id or inviteCode (case-insensitive)
  const group = groups.find(
    (g) =>
      g.id === id ||
      g.inviteCode === id ||
      g.id.toLowerCase() === id.toLowerCase() ||
      g.inviteCode?.toLowerCase() === id.toLowerCase()
  );

  if (!group) {
    return (
      <AppLayout>
        <div className="text-center py-20 space-y-4">
          <p className="text-base text-slate-300">Group not found or has been deleted.</p>
          <Link href="/groups" className="text-xs text-blue-400 hover:underline">
            &larr; Return to Groups
          </Link>
        </div>
      </AppLayout>
    );
  }

  // Filter expenses and settlements matching canonical group.id or inviteCode
  const groupExpenses = expenses.filter(
    (e) => e.groupId === group.id || (group.inviteCode && e.groupId === group.inviteCode)
  );
  const groupSettlements = settlements.filter(
    (s) => s.groupId === group.id || (group.inviteCode && s.groupId === group.inviteCode)
  );

  // Compute live balances and optimal debt simplification
  const balances = calculateGroupBalances(group.members, groupExpenses, groupSettlements);
  const debtPlan = calculateSimplifiedSettlements(balances);

  const totalSpentPaise =
    groupExpenses.length > 0
      ? groupExpenses.reduce((acc, e) => acc + e.amountPaise, 0)
      : group.totalSpentPaise;

  const copyInviteLink = () => {
    const url = `${window.location.origin}/groups?code=${group.inviteCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const sendReminder = (debtorName: string, debtorId: string) => {
    setReminderSent(debtorId);
    setTimeout(() => setReminderSent(null), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Group Header Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden shadow-xl">
          <div className="h-44 relative bg-slate-900">
            <img
              src={group.imageUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200'}
              alt={group.name}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-5 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  CODE: {group.inviteCode}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{group.name}</h1>
                <p className="text-xs text-slate-200 max-w-xl">{group.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyInviteLink}
                  className="px-3 py-2 rounded-xl border border-white/20 bg-slate-900/90 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Share Invite'}</span>
                </button>

                <button
                  onClick={() => setShowAddExpense(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Expense</span>
                </button>
              </div>
            </div>
          </div>

          {/* Group Stat Strip */}
          <div className="p-4 sm:px-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Total Expenditure</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                {formatPaise(totalSpentPaise)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Recorded Expenses</span>
              <span className="font-bold text-slate-900 dark:text-white text-base">{groupExpenses.length} bills</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Participants</span>
              <span className="font-bold text-slate-900 dark:text-white text-base">{group.members.length} members</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Pending Transfers</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-base">{debtPlan.length} to clear</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {[
            { id: 'expenses', label: `Expenses (${groupExpenses.length})`, icon: Receipt },
            { id: 'balances', label: 'Balances & Net Share', icon: Scale },
            { id: 'settlements', label: `Settlement Plan (${debtPlan.length})`, icon: ShieldCheck },
            { id: 'members', label: `Participants (${group.members.length})`, icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Expenses */}
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            {groupExpenses.length === 0 ? (
              <div className="text-center py-16 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 space-y-3">
                <Receipt className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">No expenses recorded yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Snap a bill or enter expenses manually. All participants will be split accurately.
                </p>
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  + Add First Expense
                </button>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
                {groupExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300 font-bold text-sm">
                        {exp.category[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{exp.title}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                            {exp.category}
                          </span>
                          {exp.receiptUrl && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold">
                              Receipt OCR
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          Paid by <span className="text-slate-800 dark:text-slate-200 font-semibold">{exp.paidByUserName}</span> on {exp.date} &bull; {exp.splitType} split across {exp.splits.length} people
                        </p>
                        {exp.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">&ldquo;{exp.description}&rdquo;</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                          {formatPaise(exp.amountPaise)}
                        </span>
                        <span className="text-[10px] text-slate-500 block">Total cost</span>
                      </div>

                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Balances & Net Share */}
        {activeTab === 'balances' && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Group Net Balances</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Exact financial standing: amount paid vs. allocated consumption share
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="pb-3 font-semibold">Member</th>
                    <th className="pb-3 font-semibold">Total Paid</th>
                    <th className="pb-3 font-semibold">Total Share</th>
                    <th className="pb-3 font-semibold text-right">Net Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {balances.map((b) => (
                    <tr key={b.userId} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3.5 flex items-center gap-2.5">
                        <img src={b.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-200">
                            {b.userName} {b.userId === currentUser.id ? '(You)' : ''}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300 font-medium">
                        {formatPaise(b.totalPaidPaise)}
                      </td>
                      <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300 font-medium">
                        {formatPaise(b.totalSharePaise)}
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold">
                        {b.netPaise > 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">+{formatPaise(b.netPaise)} (Receives)</span>
                        ) : b.netPaise < 0 ? (
                          <span className="text-amber-600 dark:text-amber-400">-{formatPaise(Math.abs(b.netPaise))} (Owes)</span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">₹0.00 (Settled)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Settlement Plan (Debt Simplification) */}
        {activeTab === 'settlements' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Min-Cash-Flow Optimal Plan</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Suggested Direct Settlements</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Settle all debts in the fewest possible peer-to-peer transfers
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSettleRecipientId(undefined);
                    setSettleAmountPaise(undefined);
                    setShowSettlementModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Scale className="w-4 h-4" />
                  <span>Record Custom Settlement</span>
                </button>
              </div>

              {debtPlan.length === 0 ? (
                <div className="text-center py-10 text-xs text-emerald-400 font-semibold">
                  All debts in this group are 100% settled! Everyone is even.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {debtPlan.map((plan, idx) => {
                    const isCurrentUserFrom = plan.fromUserId === currentUser.id;
                    const isCurrentUserTo = plan.toUserId === currentUser.id;

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-400">Transfer #{idx + 1}</span>
                          <span className="font-mono font-bold text-base text-white">
                            {formatPaise(plan.amountPaise)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 text-xs">
                          <div className="font-semibold text-amber-300">
                            {plan.fromUserName} {isCurrentUserFrom ? '(You)' : ''}
                          </div>
                          <span className="text-slate-500 text-[10px] font-medium">pays</span>
                          <div className="font-semibold text-emerald-300">
                            {plan.toUserName} {isCurrentUserTo ? '(You)' : ''}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          {isCurrentUserTo && (
                            <button
                              onClick={() => sendReminder(plan.fromUserName, plan.fromUserId)}
                              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                            >
                              <BellRing className="w-3 h-3" />
                              <span>{reminderSent === plan.fromUserId ? 'Reminder Sent!' : 'Remind'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSettleRecipientId(plan.toUserId);
                              setSettleAmountPaise(plan.amountPaise);
                              setShowSettlementModal(true);
                            }}
                            className="ml-auto px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <span>Mark Settled</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Participants */}
        {activeTab === 'members' && (
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-base font-bold text-white">Group Participants</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {group.members.map((member) => (
                <div
                  key={member.userId}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center gap-3"
                >
                  <img src={member.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {member.fullName} {member.userId === currentUser.id ? '(You)' : ''}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{member.email}</p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-bold mt-1 inline-block">
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAddExpense && (
        <CreateExpenseModal defaultGroupId={group.id} onClose={() => setShowAddExpense(false)} />
      )}

      {showSettlementModal && (
        <SettlementModal
          groupId={group.id}
          groupName={group.name}
          defaultToUserId={settleRecipientId}
          defaultAmountPaise={settleAmountPaise}
          members={group.members}
          onClose={() => setShowSettlementModal(false)}
        />
      )}
    </AppLayout>
  );
}

export default function GroupDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
          Loading group details...
        </div>
      }
    >
      <GroupDetailContent />
    </Suspense>
  );
}
