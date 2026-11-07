'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { formatPaise } from '@/lib/financial';
import {
  Lightbulb,
  CheckCircle2,
  Clock,
  Sparkles,
  Upload,
  ArrowRight,
  PlusCircle,
  FileText,
  AlertTriangle,
  Loader2,
  MessageSquare,
} from 'lucide-react';

export default function ProjectManagePage() {
  const { projects, currentUser, submitMilestone } = useApp();

  const myProjects = projects.filter((p) => p.creatorId === currentUser.id);
  const activeProject = myProjects[0] || projects[0];

  // Submission modal state
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [subTitle, setSubTitle] = useState('');
  const [subNotes, setSubNotes] = useState('');
  const [subEvidenceUrl, setSubEvidenceUrl] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  // Update modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');

  if (!activeProject) {
    return (
      <AppLayout>
        <div className="text-center py-20 space-y-4">
          <p className="text-base text-slate-300">You have not launched any innovation projects yet.</p>
          <Link
            href="/projects/create"
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
          >
            Create Your First Project
          </Link>
        </div>
      </AppLayout>
    );
  }

  const selectedMilestone = activeProject.milestones.find((m) => m.id === selectedMilestoneId);

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestoneId || !subTitle.trim() || !subNotes.trim()) return;

    setIsSubmitting(true);

    try {
      // 1. Call Gemini Progress Analysis
      const aiRes = await fetch('/api/ai/analyze-milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneTitle: selectedMilestone?.title || 'Milestone Deliverable',
          submissionNotes: subNotes,
          evidenceUrls: [subEvidenceUrl],
        }),
      });

      const aiData = await aiRes.json();
      const analysis = aiData.data;

      // 2. Submit to store
      submitMilestone(activeProject.id, selectedMilestoneId, {
        title: subTitle,
        notes: subNotes,
        evidenceUrls: [subEvidenceUrl],
        aiAnalysis: analysis,
        reviewerStatus: 'pending',
        submittedBy: currentUser.fullName,
      });

      setAiReport(analysis);
      setTimeout(() => {
        setIsSubmitting(false);
        setSelectedMilestoneId(null);
        setSubTitle('');
        setSubNotes('');
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Creator Dashboard
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{activeProject.title}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Manage development milestones, submit benchmark evidence, and review Gemini AI progress audits
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/projects/${activeProject.id}`}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              Public View
            </Link>
            <Link
              href="/projects/create"
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Project</span>
            </Link>
          </div>
        </div>

        {/* Milestones Management Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Project Milestones</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Click &ldquo;Submit Evidence&rdquo; on an upcoming or in-progress milestone to run AI verification
            </span>
          </div>

          <div className="space-y-4">
            {activeProject.milestones.map((ms) => {
              const isCompleted = ms.status === 'completed' || ms.status === 'approved';
              const isSubmitted = ms.status === 'submitted';

              return (
                <div
                  key={ms.id}
                  className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : isSubmitted
                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        #{ms.orderIndex}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{ms.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{ms.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          isCompleted
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : isSubmitted
                            ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {ms.status.replace('_', ' ')}
                      </span>

                      {!isCompleted && !isSubmitted && (
                        <button
                          onClick={() => {
                            setSelectedMilestoneId(ms.id);
                            setSubTitle(`${ms.title} — Progress Evidence`);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/25 flex items-center gap-1.5 transition-all"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Submit Evidence</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submission and AI Analysis Logs */}
                  {ms.submissions && ms.submissions.length > 0 && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-3">
                      {ms.submissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-2 text-xs"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-200">{sub.title}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(sub.submittedAt).toLocaleDateString()} &bull; Review:{' '}
                              <strong className="text-blue-400 uppercase">{sub.reviewerStatus}</strong>
                            </span>
                          </div>
                          <p className="text-slate-400">{sub.notes}</p>

                          {sub.aiAnalysis && (
                            <div className="mt-2 p-3 rounded-xl border border-blue-500/30 bg-blue-950/20 space-y-1">
                              {sub.aiAnalysis.mock && (
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold mb-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Demo data — no API key configured</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-blue-300 font-bold text-[11px]">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>
                                  Gemini Verification Score: {sub.aiAnalysis.verificationScore}/100 &bull; Risk: {sub.aiAnalysis.riskAssessment.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-slate-300 text-[11px]">{sub.aiAnalysis.progressSummary}</p>
                              <p className="text-slate-400 text-[11px] font-mono">
                                BOM Utilization: {sub.aiAnalysis.budgetUtilization}
                              </p>
                              <p className="text-[10px] text-slate-500 italic pt-1">
                                {sub.aiAnalysis.disclaimer}
                              </p>
                            </div>
                          )}

                          {sub.reviewerFeedback && (
                            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                              <span className="font-semibold text-emerald-400">Mentor Review Feedback: </span>
                              {sub.reviewerFeedback}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Evidence Submission Modal */}
        {selectedMilestoneId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Submit Milestone Evidence</h3>
                </div>
                <button
                  onClick={() => setSelectedMilestoneId(null)}
                  className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deliverable Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Progress Notes & Benchmark Results *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Document test metrics, latency, frame rates, payload capacity, and hardware BOM..."
                    value={subNotes}
                    onChange={(e) => setSubNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Evidence Image / Video Link
                  </label>
                  <input
                    type="url"
                    value={subEvidenceUrl}
                    onChange={(e) => setSubEvidenceUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs shadow-sm"
                  />
                </div>

                <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-500/20 text-[11px] text-violet-700 dark:text-violet-300">
                  Submitting will automatically invoke Gemini 2.5 to evaluate technical progress against deliverables and generate a verification score.
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMilestoneId(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-violet-600/30 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Running AI Analysis...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Run AI Evaluation & Submit</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
