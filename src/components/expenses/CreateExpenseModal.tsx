'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Group, SplitType, ExpenseSplit, ReceiptScanData } from '@/types';
import {
  rupeesToPaise,
  paiseToRupees,
  formatPaise,
  calculateEqualSplit,
  calculatePercentageSplit,
  validateSplitSum,
} from '@/lib/financial';
import {
  X,
  Receipt,
  Sparkles,
  Upload,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  PieChart,
  Split,
  Sliders,
  Check,
} from 'lucide-react';

interface Props {
  defaultGroupId?: string;
  onClose: () => void;
}

export function CreateExpenseModal({ defaultGroupId, onClose }: Props) {
  const { groups, currentUser, createExpense } = useApp();

  const [selectedGroupId, setSelectedGroupId] = useState(defaultGroupId || groups[0]?.id || '');
  const [title, setTitle] = useState('');
  const [amountRupees, setAmountRupees] = useState<string>('');
  const [category, setCategory] = useState('Food & Drinks');
  const [paidByUserId, setPaidByUserId] = useState(currentUser.id);
  const [date, setDate] = useState('2026-11-01');

  useEffect(() => {
    try {
      setDate(new Date().toISOString().split('T')[0]);
    } catch {
      // fallback
    }
  }, []);
  const [description, setDescription] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('equal');

  // Custom split allocations
  const [customShares, setCustomShares] = useState<Record<string, string>>({});
  const [percentages, setPercentages] = useState<Record<string, number>>({});

  // Receipt Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ReceiptScanData | null>(null);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [scanFeedback, setScanFeedback] = useState<string>('');

  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const members = activeGroup?.members || [];

  const totalPaise = rupeesToPaise(amountRupees || '0');

  // Initialize splits when members or total change
  useEffect(() => {
    if (members.length === 0) return;

    if (splitType === 'equal') {
      // automatically calculated
    } else if (splitType === 'percentage') {
      const equalPct = Math.floor(100 / members.length);
      const newPcts: Record<string, number> = {};
      members.forEach((m, idx) => {
        newPcts[m.userId] = idx === 0 ? 100 - equalPct * (members.length - 1) : equalPct;
      });
      setPercentages(newPcts);
    } else if (splitType === 'custom') {
      const equalSharePaise = Math.floor(totalPaise / members.length);
      const newShares: Record<string, string> = {};
      members.forEach((m) => {
        newShares[m.userId] = (equalSharePaise / 100).toFixed(2);
      });
      setCustomShares(newShares);
    }
  }, [selectedGroupId, splitType]);

  // Compute final splits
  const getCalculatedSplits = (): ExpenseSplit[] => {
    if (members.length === 0) return [];

    if (splitType === 'equal') {
      const computed = calculateEqualSplit(
        totalPaise,
        members.map((m) => ({ userId: m.userId, userName: m.fullName }))
      );
      return computed.map((c) => ({
        userId: c.userId,
        userName: c.userName,
        amountPaise: c.amountPaise,
      }));
    }

    if (splitType === 'percentage') {
      const computed = calculatePercentageSplit(
        totalPaise,
        members.map((m) => ({
          userId: m.userId,
          userName: m.fullName,
          percentage: percentages[m.userId] || 0,
        }))
      );
      return computed.map((c) => ({
        userId: c.userId,
        userName: c.userName,
        amountPaise: c.amountPaise,
        percentage: c.percentage,
      }));
    }

    // Custom
    return members.map((m) => ({
      userId: m.userId,
      userName: m.fullName,
      amountPaise: rupeesToPaise(customShares[m.userId] || '0'),
    }));
  };

  const calculatedSplits = getCalculatedSplits();
  const splitsSumPaise = calculatedSplits.reduce((acc, s) => acc + s.amountPaise, 0);
  const isSplitValid = totalPaise > 0 && splitsSumPaise === totalPaise;

  // Receipt Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanFeedback('Analyzing receipt with Gemini Vision...');

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setReceiptImage(base64);

      try {
        const response = await fetch('/api/ai/scan-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/jpeg',
          }),
        });

        const data = await response.json();
        if (data.success && data.data) {
          setScanResult(data.data);
          setScanFeedback('Receipt extracted! Review and confirm items below.');
        } else {
          setScanFeedback('Could not parse receipt automatically.');
        }
      } catch (err: any) {
        setScanFeedback('Failed to reach AI scanner.');
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply scanned receipt to form
  const applyScanResult = () => {
    if (!scanResult) return;
    setTitle(scanResult.merchantName || title || 'Scanned Expense');
    setAmountRupees((scanResult.totalPaise / 100).toFixed(2));
    if (scanResult.purchaseDate) setDate(scanResult.purchaseDate);
    setDescription(`Scanned Invoice from ${scanResult.merchantName}. Items: ${scanResult.items.map((i) => i.name).join(', ')}`);
    setScanFeedback('Scanned details applied to expense form!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || totalPaise <= 0 || !isSplitValid || !activeGroup) return;

    const paidMember = members.find((m) => m.userId === paidByUserId) || {
      fullName: currentUser.fullName,
    };

    createExpense({
      groupId: activeGroup.id,
      groupName: activeGroup.name,
      title: title.trim(),
      description: description.trim(),
      amountPaise: totalPaise,
      category,
      paidByUserId,
      paidByUserName: paidMember.fullName,
      date,
      splitType,
      splits: calculatedSplits,
      receiptUrl: receiptImage || undefined,
      receiptData: scanResult || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8 my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Add New Expense</h2>
            <p className="text-xs text-slate-400">
              Split shared costs equally or custom with paise-level exact math
            </p>
          </div>
        </div>

        {/* AI Receipt Scanning Box */}
        <div className="mb-6 p-4 rounded-2xl border border-blue-500/25 bg-blue-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600/30 text-blue-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  AI Receipt Scanner (Google Gemini Multimodal)
                </p>
                <p className="text-[11px] text-slate-400">
                  Upload an image of your bill to extract items, tax, and total automatically
                </p>
              </div>
            </div>

            <label className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-lg shadow-blue-600/25 transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>{isScanning ? 'Scanning...' : 'Upload Receipt'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isScanning}
                className="hidden"
              />
            </label>
          </div>

          {scanFeedback && (
            <p className="text-xs text-blue-300 mt-2.5 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {scanFeedback}
            </p>
          )}

          {/* Scanned Items Confirmation Preview */}
          {scanResult && (
            <div className="mt-3 pt-3 border-t border-blue-500/20 space-y-2">
              {scanResult.mock && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Demo data — no API key configured</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-white">{scanResult.merchantName}</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatPaise(scanResult.totalPaise)}
                </span>
              </div>
              <div className="max-h-24 overflow-y-auto text-[11px] text-slate-400 space-y-1">
                {scanResult.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {item.quantity ? `${item.quantity}x ` : ''}
                      {item.name}
                    </span>
                    <span className="font-mono">{formatPaise(item.pricePaise)}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={applyScanResult}
                className="w-full py-1.5 mt-1 rounded-lg bg-blue-500/30 hover:bg-blue-500/40 text-blue-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Scanned Amounts to Expense Form
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Group *</label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
              >
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expense Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Seafood Dinner, Uber from Airport"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Amount (₹ INR) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amountRupees}
                onChange={(e) => setAmountRupees(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Paid By</label>
              <select
                value={paidByUserId}
                onChange={(e) => setPaidByUserId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                {members.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.fullName} {m.userId === currentUser.id ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Splitting Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Split Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSplitType('equal')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  splitType === 'equal'
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span>Equal Split</span>
              </button>
              <button
                type="button"
                onClick={() => setSplitType('percentage')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  splitType === 'percentage'
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Percentage</span>
              </button>
              <button
                type="button"
                onClick={() => setSplitType('custom')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  splitType === 'custom'
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Custom Amount</span>
              </button>
            </div>
          </div>

          {/* Split Matrix Breakdown */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold text-slate-300">Participant</span>
              <span>Individual Share</span>
            </div>

            {members.map((member) => {
              const split = calculatedSplits.find((s) => s.userId === member.userId);
              return (
                <div key={member.userId} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={member.avatarUrl}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-slate-200">
                      {member.fullName} {member.userId === currentUser.id ? '(You)' : ''}
                    </span>
                  </div>

                  {splitType === 'equal' && (
                    <span className="font-mono font-medium text-slate-300">
                      {formatPaise(split?.amountPaise || 0)}
                    </span>
                  )}

                  {splitType === 'percentage' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={percentages[member.userId] ?? 0}
                        onChange={(e) =>
                          setPercentages({
                            ...percentages,
                            [member.userId]: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-14 px-2 py-1 rounded-lg border border-slate-800 bg-slate-900 text-right font-mono text-xs text-white"
                      />
                      <span className="text-slate-500">%</span>
                      <span className="font-mono text-slate-400 w-20 text-right">
                        {formatPaise(split?.amountPaise || 0)}
                      </span>
                    </div>
                  )}

                  {splitType === 'custom' && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={customShares[member.userId] ?? '0'}
                        onChange={(e) =>
                          setCustomShares({
                            ...customShares,
                            [member.userId]: e.target.value,
                          })
                        }
                        className="w-24 px-2 py-1 rounded-lg border border-slate-800 bg-slate-900 text-right font-mono text-xs text-white"
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Sum validation warning */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Total Allocated:</span>
              <span className={isSplitValid ? 'text-emerald-400' : 'text-amber-400'}>
                {formatPaise(splitsSumPaise)} / {formatPaise(totalPaise)}
              </span>
            </div>

            {!isSplitValid && totalPaise > 0 && (
              <p className="text-[11px] text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                The sum of participant shares must exactly equal the total expense amount.
              </p>
            )}
          </div>

          {/* Action buttons */}
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
              disabled={!isSplitValid || !title.trim()}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
