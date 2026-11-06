'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { GroupMember, PaymentMethod } from '@/types';
import { formatPaise, rupeesToPaise } from '@/lib/financial';
import { X, Scale, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Props {
  groupId: string;
  groupName: string;
  defaultToUserId?: string;
  defaultAmountPaise?: number;
  members: GroupMember[];
  onClose: () => void;
}

export function SettlementModal({
  groupId,
  groupName,
  defaultToUserId,
  defaultAmountPaise,
  members,
  onClose,
}: Props) {
  const { currentUser, createSettlement, markSettlementCompleted } = useApp();

  const otherMembers = members.filter((m) => m.userId !== currentUser.id);

  const [toUserId, setToUserId] = useState(defaultToUserId || otherMembers[0]?.userId || '');
  const [amountRupees, setAmountRupees] = useState(
    defaultAmountPaise ? (defaultAmountPaise / 100).toFixed(2) : ''
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [isCompletedImmediately, setIsCompletedImmediately] = useState(true);

  const recipient = members.find((m) => m.userId === toUserId);
  const amountPaise = rupeesToPaise(amountRupees || '0');

  const isPayPalConfigured = Boolean(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== 'sb' &&
    !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID.startsWith('your-')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toUserId || amountPaise <= 0 || !recipient) return;

    const settlement = createSettlement({
      groupId,
      groupName,
      fromUserId: currentUser.id,
      fromUserName: currentUser.fullName,
      toUserId: recipient.userId,
      toUserName: recipient.fullName,
      amountPaise,
      status: isCompletedImmediately ? 'completed' : 'pending',
      paymentMethod,
      transactionRef: transactionRef || undefined,
      notes: notes || undefined,
      completedAt: isCompletedImmediately ? new Date().toISOString() : undefined,
    });

    if (isCompletedImmediately) {
      markSettlementCompleted(settlement.id);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Record Settlement</h2>
            <p className="text-xs text-slate-400">
              Clear pending balances for <span className="text-slate-200 font-semibold">{groupName}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <img src={currentUser.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
              <span className="font-semibold text-white">{currentUser.fullName}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{recipient?.fullName || 'Select recipient'}</span>
              {recipient && (
                <img src={recipient.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Paying To *</label>
            <select
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {otherMembers.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.fullName} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Settlement Amount (₹ INR) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              value={amountRupees}
              onChange={(e) => setAmountRupees(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono text-base focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'upi', label: 'UPI / GPay', disabled: false },
                { id: 'cash', label: 'Cash', disabled: false },
                { id: 'paypal', label: isPayPalConfigured ? 'PayPal' : 'PayPal (Disabled)', disabled: !isPayPalConfigured },
                { id: 'bank_transfer', label: 'Bank Transfer', disabled: false },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  disabled={m.disabled}
                  onClick={() => !m.disabled && setPaymentMethod(m.id as PaymentMethod)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    m.disabled
                      ? 'border-slate-800/50 bg-slate-950/40 text-slate-600 cursor-not-allowed opacity-50'
                      : paymentMethod === m.id
                      ? 'border-emerald-500 bg-emerald-600/20 text-emerald-300 font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                  title={m.disabled ? 'PayPal Sandbox not configured in environment' : undefined}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Transaction ID / Reference (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. UPI Ref 3928172910, Bank UTR"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isCompletedImmediately}
              onChange={(e) => setIsCompletedImmediately(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-950"
            />
            <span className="text-xs text-slate-300 font-medium">
              Mark as already paid & completed (instantly updates group net balance)
            </span>
          </label>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={amountPaise <= 0 || !toUserId}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              Confirm Settlement ({formatPaise(amountPaise)})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
