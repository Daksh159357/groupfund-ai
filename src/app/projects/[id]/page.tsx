'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { formatPaise } from '@/lib/financial';
import confetti from 'canvas-confetti';
import {
  Lightbulb,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  HeartHandshake,
  ShieldCheck,
  Cpu,
  Share2,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { PayPalContributionButton } from '@/components/paypal/PayPalContributionButton';

function ProjectDetailContent() {
  const routeParams = useParams();
  const searchParams = useSearchParams();
  const id = (routeParams?.id as string) || '';
  const { projects, currentUser, contributeToProject } = useApp();

  const token = searchParams?.get('token');
  const payerId = searchParams?.get('PayerID');
  const isCancelledParam = searchParams?.get('cancelled') === 'true';

  const [paymentNotice, setPaymentNotice] = useState<{
    type: 'success' | 'cancelled' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isCapturingOrder, setIsCapturingOrder] = useState(false);
  const captureAttemptedRef = useRef(false);

  useEffect(() => {
    if (isCancelledParam) {
      setPaymentNotice({
        type: 'cancelled',
        message: 'PayPal checkout was cancelled. No funds were debited.',
      });
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', window.location.pathname);
      }
      return;
    }

    if (token && payerId && !captureAttemptedRef.current) {
      captureAttemptedRef.current = true;
      setIsCapturingOrder(true);

      let pendingData: any = null;
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem(`pending_paypal_${token}`);
          if (raw) pendingData = JSON.parse(raw);
        } catch (e) {
          console.warn('Failed to parse pending paypal data', e);
        }
      }

      const amountPaise = pendingData?.amountPaise || 10000;
      const contributorName = pendingData?.contributorName || currentUser.fullName;
      const message = pendingData?.message || '';

      fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: token,
          projectId: id,
          amountPaise,
          contributorName,
          message,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!data.success) {
            throw new Error(data.error || 'Payment capture failed');
          }
          return data;
        })
        .then((data) => {
          const finalAmountPaise = data.amountPaise || amountPaise;
          contributeToProject(
            id,
            finalAmountPaise,
            contributorName,
            token,
            data.captureId,
            message
          );

          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
          });

          setPaymentNotice({
            type: 'success',
            message: `Contribution of ${formatPaise(finalAmountPaise)} successfully captured & verified via PayPal Sandbox!`,
          });

          if (typeof window !== 'undefined') {
            localStorage.removeItem(`pending_paypal_${token}`);
            window.history.replaceState({}, '', window.location.pathname);
          }
        })
        .catch((err: any) => {
          console.error('PayPal capture error:', err);
          const rawErr = String(err?.message || '');
          const isDuplicate =
            rawErr.includes('Duplicate payment capture') ||
            rawErr.includes('already been captured') ||
            rawErr.includes('ORDER_ALREADY_CAPTURED');

          const isIndiaOrApprovalIssue =
            rawErr.includes('ORDER_NOT_APPROVED') ||
            rawErr.includes('CURRENCY_NOT_SUPPORTED') ||
            rawErr.includes('currency') ||
            rawErr.includes('422');

          const friendlyMsg = isDuplicate
            ? 'This contribution has already been verified and credited to the project ledger.'
            : isIndiaOrApprovalIssue
            ? 'PayPal rejected this payment. If you are logged in with an India sandbox account, please use a US sandbox buyer — PayPal India does not support domestic transactions.'
            : rawErr || 'Failed to capture PayPal payment.';

          setPaymentNotice({
            type: isDuplicate ? 'success' : 'error',
            message: friendlyMsg,
          });
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, '', window.location.pathname);
          }
        })
        .finally(() => {
          setIsCapturingOrder(false);
        });
    }
  }, [token, payerId, isCancelledParam, id, currentUser.fullName, contributeToProject]);

  const project = projects.find((p) => p.id === id);

  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'budget' | 'updates' | 'backers'>('overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!project) {
    return (
      <AppLayout>
        <div className="text-center py-20 space-y-4">
          <p className="text-base text-slate-300">Project not found or removed.</p>
          <Link href="/discover" className="text-xs text-blue-400 hover:underline">
            &larr; Back to Discover
          </Link>
        </div>
      </AppLayout>
    );
  }

  const progress = Math.min(
    100,
    Math.round((project.raisedAmountPaise / project.targetAmountPaise) * 100)
  );

  const copyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Top Breadcrumbs */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Link href="/discover" className="hover:text-white transition-colors">
              Discover Projects
            </Link>
            <span>&bull;</span>
            <span className="text-violet-400 font-semibold">{project.category}</span>
          </div>

          <button
            onClick={copyShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Project'}</span>
          </button>
        </div>

        {/* PayPal Sandbox Return Banners */}
        {isCapturingOrder && (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-3 text-xs text-blue-300 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-blue-400 shrink-0" />
            <div>
              <p className="font-bold">Verifying and Capturing PayPal Sandbox Payment...</p>
              <p className="text-slate-400">Order ID: {token} &bull; Please wait while your transaction is confirmed.</p>
            </div>
          </div>
        )}

        {paymentNotice.type === 'success' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-semibold">{paymentNotice.message}</span>
            </div>
            <button
              onClick={() => setPaymentNotice({ type: null, message: '' })}
              className="text-slate-400 hover:text-white text-base px-2 py-0.5"
            >
              &times;
            </button>
          </div>
        )}

        {paymentNotice.type === 'cancelled' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{paymentNotice.message}</span>
            </div>
            <button
              onClick={() => setPaymentNotice({ type: null, message: '' })}
              className="text-slate-400 hover:text-white text-base px-2 py-0.5"
            >
              &times;
            </button>
          </div>
        )}

        {paymentNotice.type === 'error' && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{paymentNotice.message}</span>
            </div>
            <button
              onClick={() => setPaymentNotice({ type: null, message: '' })}
              className="text-slate-400 hover:text-white text-base px-2 py-0.5"
            >
              &times;
            </button>
          </div>
        )}

        {/* Project Header & Media Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Media & Details (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">
              <div className="h-72 sm:h-96 relative bg-slate-800">
                <img
                  src={project.images[selectedImage] || project.images[0] || '/images/aeroclean.jpg'}
                  alt={project.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/aeroclean.jpg';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-semibold text-white">
                  {project.category}
                </div>
              </div>

              {/* Thumbnails */}
              {project.images.length > 1 && (
                <div className="p-3 bg-slate-950 flex items-center gap-2 overflow-x-auto">
                  {project.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === idx ? 'border-violet-500 scale-105' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img
                        src={img || '/images/aeroclean.jpg'}
                        alt=""
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/aeroclean.jpg';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{project.title}</h1>
              <p className="text-sm text-slate-300 leading-relaxed">{project.shortDescription}</p>

              <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <img
                    src={project.creatorAvatar}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-violet-500/50"
                  />
                  <span>
                    Initiated by <strong className="text-white">{project.creatorName}</strong>
                  </span>
                </div>
                <span>&bull;</span>
                <span className="text-violet-400 font-semibold">{project.institution}</span>
              </div>
            </div>
          </div>

          {/* Funding Card & PayPal Sandbox (1/3) */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 space-y-5">
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">
                  Total Raised
                </span>
                <p className="text-3xl font-extrabold text-white font-mono">
                  {formatPaise(project.raisedAmountPaise)}
                </p>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Goal: {formatPaise(project.targetAmountPaise)}</span>
                  <span className="font-bold text-violet-400">{progress}% Funded</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-3 text-xs border-t border-slate-800">
                <div>
                  <span className="text-slate-500 block">Total Backers</span>
                  <span className="font-bold text-white text-base">
                    {project.contributions.length} supporters
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Target Completion</span>
                  <span className="font-bold text-white text-base">
                    {new Date(project.completionDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Back with PayPal Sandbox */}
            <PayPalContributionButton
              projectId={project.id}
              projectTitle={project.title}
              defaultAmountRupees={1000}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'overview', label: 'Technical Problem & Solution' },
            { id: 'milestones', label: `Milestone Roadmap (${project.milestones.length})` },
            { id: 'budget', label: `Budget Breakdown (${project.budgetBreakdown.length})` },
            { id: 'updates', label: `Updates (${project.updates.length})` },
            { id: 'backers', label: `Supporters (${project.contributions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-bold text-sm text-white">The Engineering Problem</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {project.problemStatement}
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Cpu className="w-5 h-5" />
                <h3 className="font-bold text-sm text-white">Proposed Technical Solution</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {project.proposedSolution}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Milestones */}
        {activeTab === 'milestones' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Milestone Verification Roadmap</h3>
                <p className="text-xs text-slate-400">
                  Milestones are reviewed against submitted benchmark evidence and Gemini AI analysis
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {project.milestones.map((ms) => {
                const isCompleted = ms.status === 'completed' || ms.status === 'approved';
                const isSubmitted = ms.status === 'submitted';
                const isInProgress = ms.status === 'in_progress';

                return (
                  <div
                    key={ms.id}
                    className="p-5 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isSubmitted
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          #{ms.orderIndex}
                        </div>
                        <h4 className="font-bold text-sm text-white">{ms.title}</h4>
                      </div>

                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : isSubmitted
                            ? 'bg-blue-500/20 text-blue-300'
                            : isInProgress
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {ms.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{ms.description}</p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80">
                      <span>Target Date: {new Date(ms.targetDate).toLocaleDateString()}</span>
                      <span className="font-mono text-slate-300">
                        Allocated: {formatPaise(ms.budgetAllocatedPaise)}
                      </span>
                    </div>

                    {/* AI Assessment if submission has analysis */}
                    {ms.submissions?.[0]?.aiAnalysis && (
                      <div className="mt-2 p-3 rounded-xl border border-blue-500/20 bg-blue-950/20 space-y-1.5 text-xs">
                        {ms.submissions[0].aiAnalysis.mock && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                            <AlertCircle className="w-3 h-3" />
                            <span>Demo data — no API key configured</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            Gemini AI Progress Evaluation (Score:{' '}
                            {ms.submissions[0].aiAnalysis.verificationScore}/100 &bull; Risk:{' '}
                            {ms.submissions[0].aiAnalysis.riskAssessment.toUpperCase()})
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          {ms.submissions[0].aiAnalysis.progressSummary}
                        </p>
                        <p className="text-[10px] text-slate-500 italic">
                          {ms.submissions[0].aiAnalysis.disclaimer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Budget Breakdown */}
        {activeTab === 'budget' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Estimated Development Budget</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Hardware / Research Component</th>
                    <th className="pb-3 font-semibold">Notes / Purpose</th>
                    <th className="pb-3 font-semibold text-right">Allocated Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {project.budgetBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-3 font-semibold text-white">{item.item}</td>
                      <td className="py-3 text-slate-400">{item.notes || 'Hardware prototype BOM'}</td>
                      <td className="py-3 text-right font-mono font-bold text-white">
                        {formatPaise(item.amountPaise)}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t border-slate-700 text-sm">
                    <td colSpan={2} className="pt-4 text-slate-300">Total Project Funding Target</td>
                    <td className="pt-4 text-right font-mono text-violet-400">
                      {formatPaise(project.targetAmountPaise)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Updates */}
        {activeTab === 'updates' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Project Development Logs</h3>
            {project.updates.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No updates posted yet.</p>
            ) : (
              <div className="space-y-4">
                {project.updates.map((upd) => (
                  <div key={upd.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <h4 className="font-bold text-white">{upd.title}</h4>
                      <span className="text-slate-500 text-[10px]">
                        {new Date(upd.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{upd.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Backers */}
        {activeTab === 'backers' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Verified PayPal Sandbox Supporters</h3>
            {project.contributions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Be the first backer to support this prototype!
              </p>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {project.contributions.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{c.contributorName}</p>
                      {c.message && <p className="text-slate-400 italic text-[11px]">&ldquo;{c.message}&rdquo;</p>}
                      <span className="text-[10px] text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString()} &bull; Order ID: {c.paypalOrderId}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">
                      +{formatPaise(c.amountPaise)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
          Loading project details...
        </div>
      }
    >
      <ProjectDetailContent />
    </Suspense>
  );
}
