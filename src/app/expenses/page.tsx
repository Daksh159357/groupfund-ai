'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { formatPaise } from '@/lib/financial';
import { Receipt, PlusCircle, Search, Filter, Trash2, ArrowUpRight } from 'lucide-react';
import { CreateExpenseModal } from '@/components/expenses/CreateExpenseModal';

export default function ExpensesPage() {
  const { expenses, groups, deleteExpense } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.paidByUserName || '').toLowerCase().includes(search.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || e.groupId === selectedGroup;
    const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
    return matchesSearch && matchesGroup && matchesCat;
  });

  const totalFilteredPaise = filteredExpenses.reduce((acc, e) => acc + e.amountPaise, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Expenses Ledger</h1>
            <p className="text-xs text-slate-400">
              Audit and track shared expenses with verified split calculations
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Expense</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses or payer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Groups</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option>Food & Drinks</option>
              <option>Accommodation</option>
              <option>Transportation</option>
              <option>Hardware & Electronics</option>
              <option>Entertainment</option>
              <option>Groceries</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Expense List */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
          <div className="p-4 bg-slate-950/40 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Showing {filteredExpenses.length} transactions</span>
            <span className="font-mono text-white">
              Total: {formatPaise(totalFilteredPaise)}
            </span>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-500">
              No expenses match your active filters.
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 text-slate-300 font-bold text-xs">
                    {exp.category[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">{exp.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {exp.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      <Link href={`/groups/${exp.groupId}`} className="text-blue-400 hover:underline">
                        {exp.groupName}
                      </Link>{' '}
                      &bull; Paid by <span className="text-slate-200">{exp.paidByUserName}</span> on {exp.date}
                    </p>
                    {exp.description && (
                      <p className="text-xs text-slate-400 mt-1 italic">&ldquo;{exp.description}&rdquo;</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-bold text-white text-base">
                      {formatPaise(exp.amountPaise)}
                    </span>
                    <span className="text-[10px] text-slate-400 block capitalize">
                      {exp.splitType} split ({exp.splits.length} members)
                    </span>
                  </div>

                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddModal && <CreateExpenseModal onClose={() => setShowAddModal(false)} />}
    </AppLayout>
  );
}
