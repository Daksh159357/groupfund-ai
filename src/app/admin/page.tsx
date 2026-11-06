'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { formatPaise } from '@/lib/financial';
import {
  Shield,
  Users,
  Lightbulb,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Receipt,
  Eye,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    currentUser,
    allUsers,
    projects,
    transactions,
    updateProjectStatus,
    reviewMilestone,
    setCurrentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'projects' | 'milestones' | 'users' | 'transactions'>('projects');
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const isAdmin = currentUser.role === 'admin';

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleApproveProject = (projectId: string) => {
    updateProjectStatus(projectId, 'approved');
    showNotice('Project status updated to Approved!');
  };

  const handleRejectProject = (projectId: string) => {
    updateProjectStatus(projectId, 'rejected');
    showNotice('Project publication marked as Rejected.');
  };

  const handleReviewMilestone = (projectId: string, milestoneId: string, submissionId: string, approved: boolean) => {
    const feedback = feedbackInput[submissionId] || (approved ? 'Milestone benchmark criteria verified.' : 'Needs additional telemetry proof.');
    reviewMilestone(projectId, milestoneId, submissionId, approved, feedback);
    showNotice(`Milestone submission ${approved ? 'approved' : 'rejected'}!`);
  };

  // Find all pending milestone submissions across projects
  const pendingSubmissions: { project: any; milestone: any; submission: any }[] = [];
  projects.forEach((p) => {
    p.milestones.forEach((m) => {
      m.submissions?.forEach((s) => {
        if (s.reviewerStatus === 'pending') {
          pendingSubmissions.push({ project: p, milestone: m, submission: s });
        }
      });
    });
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">Platform Admin Dashboard</h1>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                  RBAC SECURED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Moderate innovation projects, review milestone evidence, and audit platform transactions
              </p>
            </div>
          </div>

          {!isAdmin && (
            <div className="p-3 rounded-2xl border border-amber-500/30 bg-amber-950/20 flex items-center gap-3 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-amber-200">
                You are currently logged in as a normal user ({currentUser.fullName}).
              </span>
              <button
                onClick={() => {
                  const adminUser = allUsers.find((u) => u.role === 'admin') || allUsers[allUsers.length - 1];
                  setCurrentUser(adminUser);
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
              >
                Switch to Admin
              </button>
            </div>
          )}
        </div>

        {actionNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'projects', label: `Project Moderation (${projects.length})` },
            { id: 'milestones', label: `Pending Milestone Reviews (${pendingSubmissions.length})` },
            { id: 'users', label: `Registered Users (${allUsers.length})` },
            { id: 'transactions', label: `Transaction Monitor (${transactions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Project Moderation */}
        {activeTab === 'projects' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
            {projects.map((proj) => (
              <div key={proj.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <img
                    src={proj.images[0]}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">{proj.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase font-bold">
                        {proj.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {proj.institution} &bull; Created by {proj.creatorName} &bull; Goal:{' '}
                      <span className="font-mono text-white">{formatPaise(proj.targetAmountPaise)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link
                    href={`/projects/${proj.id}`}
                    className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    title="View public project page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  {proj.status !== 'approved' && (
                    <button
                      onClick={() => handleApproveProject(proj.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {proj.status !== 'rejected' && (
                    <button
                      onClick={() => handleRejectProject(proj.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Pending Milestone Reviews */}
        {activeTab === 'milestones' && (
          <div className="space-y-4">
            {pendingSubmissions.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-500 rounded-3xl border border-slate-800 bg-slate-900/40">
                No milestone submissions currently awaiting mentor review.
              </div>
            ) : (
              pendingSubmissions.map(({ project, milestone, submission }) => (
                <div
                  key={submission.id}
                  className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-purple-400 font-bold uppercase">
                        Project: {project.title}
                      </p>
                      <h3 className="font-bold text-base text-white mt-0.5">
                        {milestone.title} &bull; {submission.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Submitted by {submission.submittedBy} on{' '}
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold uppercase self-start sm:self-auto">
                      Review Pending
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <span className="font-semibold text-slate-300">Creator Progress Notes:</span>
                    <p className="text-slate-400">{submission.notes}</p>
                  </div>

                  {/* Gemini AI Verification Report */}
                  {submission.aiAnalysis && (
                    <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between flex-wrap gap-2 text-blue-300 font-bold">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          <span>
                            Gemini 2.5 Verification Assessment &bull; Score:{' '}
                            {submission.aiAnalysis.verificationScore}/100 &bull; Risk:{' '}
                            {submission.aiAnalysis.riskAssessment.toUpperCase()}
                          </span>
                        </div>
                        {submission.aiAnalysis.mock && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Demo data — no API key configured
                          </span>
                        )}
                      </div>
                      <p className="text-slate-200">{submission.aiAnalysis.progressSummary}</p>
                      <p className="text-slate-400 font-mono text-[11px]">
                        Budget Utilization: {submission.aiAnalysis.budgetUtilization}
                      </p>
                      <p className="text-[10px] text-slate-500 italic">
                        {submission.aiAnalysis.disclaimer}
                      </p>
                    </div>
                  )}

                  {/* Feedback & Actions */}
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      placeholder="Mentor feedback notes..."
                      value={feedbackInput[submission.id] || ''}
                      onChange={(e) =>
                        setFeedbackInput({ ...feedbackInput, [submission.id]: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs"
                    />

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() =>
                          handleReviewMilestone(project.id, milestone.id, submission.id, false)
                        }
                        className="px-4 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-xs font-semibold transition-colors"
                      >
                        Reject Submission
                      </button>
                      <button
                        onClick={() =>
                          handleReviewMilestone(project.id, milestone.id, submission.id, true)
                        }
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Milestone</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
            {allUsers.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-white">
                      {user.fullName} {user.id === currentUser.id ? '(Active)' : ''}
                    </p>
                    <p className="text-slate-400 text-[11px]">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase font-bold">
                    {user.role}
                  </span>
                  <button
                    onClick={() => setCurrentUser(user)}
                    className="px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                  >
                    Impersonate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Transactions */}
        {activeTab === 'transactions' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">{tx.title}</p>
                  <p className="text-slate-400 text-[11px]">
                    ID: {tx.id} &bull; Type: {tx.type} &bull; {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white">
                    {formatPaise(tx.amountPaise)}
                  </span>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
