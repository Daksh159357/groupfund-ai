'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatPaise, rupeesToPaise } from '@/lib/financial';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShieldCheck, Sparkles, Loader2, HeartHandshake } from 'lucide-react';

interface Props {
  projectId: string;
  projectTitle: string;
  defaultAmountRupees?: number;
  onSuccess?: () => void;
}

export function PayPalContributionButton({
  projectId,
  projectTitle,
  defaultAmountRupees = 500,
  onSuccess,
}: Props) {
  const { currentUser, contributeToProject } = useApp();

  const isPayPalConfigured = Boolean(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== 'sb' &&
    !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID.startsWith('your-')
  );

  const [amountRupees, setAmountRupees] = useState<number>(defaultAmountRupees);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const amountPaise = rupeesToPaise(amountRupees);
  const approxUSD = ((amountRupees || 0) / 83).toFixed(2);

  const presetAmounts = [250, 500, 1000, 2500, 5000];

  const handleContribute = async () => {
    if (!isPayPalConfigured) {
      setErrorMsg('PayPal Sandbox not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env.local');
      return;
    }
    if (amountPaise <= 0) return;

    setIsProcessing(true);
    setErrorMsg('');

    try {
      // 1. Create order on backend with PayPal Orders v2
      const orderRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountPaise,
          projectId,
          projectTitle,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize PayPal order');
      }

      const approveUrl =
        orderData.approveUrl ||
        orderData.order?.links?.find((l: any) => l.rel === 'approve' || l.rel === 'payer-action')?.href;

      if (!approveUrl) {
        throw new Error('PayPal did not return an approval checkout URL');
      }

      // Persist pending contribution parameters for the return handler
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `pending_paypal_${orderData.orderId}`,
          JSON.stringify({
            projectId,
            amountPaise,
            contributorName: currentUser.fullName,
            message,
          })
        );
      }

      // 2. Redirect to PayPal Sandbox checkout approval URL
      window.location.href = approveUrl;
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing error');
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 rounded-3xl border border-emerald-500/40 bg-emerald-950/20 text-center animate-in zoom-in-95">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white">Payment Verified via PayPal Sandbox!</h4>
        <p className="text-xs text-slate-300 mt-1">
          Thank you for backing <span className="font-semibold text-emerald-300">{projectTitle}</span> with{' '}
          <span className="font-bold text-white">{formatPaise(amountPaise)}</span>.
        </p>
        <p className="text-[11px] text-slate-500 mt-2 font-mono">
          PayPal Capture Verified &bull; Status: COMPLETED
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-4 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
        >
          Make Another Contribution
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-sm text-white">Back This Innovation</h3>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
          isPayPalConfigured
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isPayPalConfigured ? 'PayPal Sandbox Verified' : 'PayPal Sandbox Not Configured'}</span>
        </div>
      </div>

      {/* Preset Amount Chips */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">Select Contribution Amount</label>
        <div className="grid grid-cols-5 gap-1.5">
          {presetAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmountRupees(amt)}
              className={`py-1.5 px-2 rounded-xl text-xs font-medium font-mono border transition-all ${
                amountRupees === amt
                  ? 'border-blue-500 bg-blue-600/20 text-blue-300 font-bold'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Amount (₹ INR)</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-sm">
            ₹
          </span>
          <input
            type="number"
            min="10"
            step="10"
            value={amountRupees || ''}
            onChange={(e) => setAmountRupees(parseFloat(e.target.value) || 0)}
            className="w-full pl-8 pr-20 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
            ≈ ${approxUSD} USD
          </span>
        </div>
      </div>

      {/* Encouragement message */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Words of Encouragement (Optional)</label>
        <input
          type="text"
          placeholder="e.g. Keep innovating! Can’t wait to see the working robot."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
        />
      </div>

      {errorMsg && (
        <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/50">
          {errorMsg}
        </p>
      )}

      {/* Official PayPal Sandbox Button */}
      <button
        onClick={handleContribute}
        disabled={!isPayPalConfigured || isProcessing || amountPaise <= 0}
        className={`w-full py-3 px-4 rounded-2xl font-semibold text-xs shadow-lg flex items-center justify-center gap-2 transition-all ${
          !isPayPalConfigured
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
            : 'bg-[#0070ba] hover:bg-[#005ea6] text-white shadow-blue-900/30 active:scale-[0.99] disabled:opacity-50'
        }`}
      >
        {!isPayPalConfigured ? (
          <span>PayPal Sandbox not configured</span>
        ) : isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting to PayPal Sandbox...</span>
          </>
        ) : (
          <>
            <span className="font-extrabold italic">PayPal</span>
            <span>Sandbox Checkout — {formatPaise(amountPaise)}</span>
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-slate-400">
        Charged in USD via PayPal Sandbox at a fixed demo rate (₹83 = $1). Your GroupFund ledger remains in INR.
      </p>

      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">Platform Transparency Disclosure:</p>
        <p>No fake escrow. Contributions are recorded directly into project accounts to fund milestone development; funds are not held in automated conditional escrow release.</p>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>No real money charged</span>
        <span>Developer Sandbox Mode</span>
      </div>
    </div>
  );
}
