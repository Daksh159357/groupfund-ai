'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { formatPaise, rupeesToPaise } from '@/lib/financial';
import { ProjectCategory, BudgetItem, Milestone } from '@/types';
import {
  Rocket,
  Sparkles,
  Layers,
  Calendar,
  AlertCircle,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Loader2,
  Cpu,
} from 'lucide-react';

const CATEGORIES: ProjectCategory[] = [
  'Robotics',
  'Artificial Intelligence',
  'Internet of Things',
  'Agriculture Technology',
  'Electric Vehicles',
  'Renewable Energy',
  'Healthcare Technology',
  'Embedded Systems',
  'Software Development',
  'Other Engineering Innovations',
];

export default function CreateProjectPage() {
  const router = useRouter();
  const { currentUser, createProject } = useApp();

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Robotics');
  const [targetAmountRupees, setTargetAmountRupees] = useState('350000');
  const [completionDate, setCompletionDate] = useState('2026-12-31');
  const [institution, setInstitution] = useState(currentUser.institution || 'IIT Bombay Robotics Lab');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800');

  // Budget Breakdown
  const [budgetItems, setBudgetItems] = useState<{ item: string; amountRupees: string }[]>([
    { item: 'Microcontrollers & Jetson Compute Board', amountRupees: '75000' },
    { item: 'Planetary Gear Motors & Chassis Fabrication', amountRupees: '125000' },
    { item: 'Sensors, Depth Cameras & RTK-GPS', amountRupees: '100000' },
    { item: 'Battery Pack & Power Distribution Board', amountRupees: '50000' },
  ]);

  // Milestones
  const [milestones, setMilestones] = useState<{ title: string; description: string; targetDate: string; budgetRupees: string }[]>([
    {
      title: 'Phase 1: Architecture & Simulation',
      description: 'Complete CAD models, component schematics, and simulation benchmarks.',
      targetDate: '2026-08-30',
      budgetRupees: '75000',
    },
    {
      title: 'Phase 2: Working Hardware Prototype',
      description: 'Chassis fabrication, motor integration, and bench sensor telemetry.',
      targetDate: '2026-10-30',
      budgetRupees: '150000',
    },
    {
      title: 'Phase 3: Autonomous Demonstration',
      description: 'Live field deployment, error analysis, and final audit report.',
      targetDate: '2026-12-31',
      budgetRupees: '125000',
    },
  ]);

  // Gemini AI Generator state
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNotice, setAiNotice] = useState('');
  const [isAiMock, setIsAiMock] = useState(false);

  const handleGeminiGenerate = async () => {
    if (!aiTopic.trim()) return;

    setIsGeneratingAi(true);
    setAiNotice('Gemini 2.5 is formulating your grant proposal, budget BOM, and milestones...');

    try {
      const response = await fetch('/api/ai/project-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic.trim(),
          category,
          action: 'generate_full_proposal',
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const d = resData.data;
        setTitle(d.title || title);
        setShortDescription(d.shortDescription || shortDescription);
        setProblemStatement(d.problemStatement || problemStatement);
        setProposedSolution(d.proposedSolution || proposedSolution);

        if (d.suggestedBudget && d.suggestedBudget.length > 0) {
          const newBudget = d.suggestedBudget.map((b: any) => ({
            item: b.item,
            amountRupees: (b.amountPaise / 100).toString(),
          }));
          setBudgetItems(newBudget);
          const totalBudget = d.suggestedBudget.reduce((acc: number, curr: any) => acc + curr.amountPaise, 0);
          setTargetAmountRupees((totalBudget / 100).toString());
        }

        if (d.milestones && d.milestones.length > 0) {
          const newMilestones = d.milestones.map((m: any) => ({
            title: m.title,
            description: m.description,
            targetDate: m.targetDate || '2026-12-31',
            budgetRupees: (m.budgetAllocatedPaise / 100).toString(),
          }));
          setMilestones(newMilestones);
        }

        if (d.mock) {
          setIsAiMock(true);
        } else {
          setIsAiMock(false);
        }

        setAiNotice(d.mock ? 'Demo proposal loaded (No Gemini API key configured in .env.local)' : 'Proposal generated successfully with Gemini! Review and refine below.');
      }
    } catch (err: any) {
      setAiNotice('Failed to connect to AI assistant.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetPaise = rupeesToPaise(targetAmountRupees);

    const formattedBudget: BudgetItem[] = budgetItems.map((b) => ({
      item: b.item,
      amountPaise: rupeesToPaise(b.amountRupees),
    }));

    const formattedMilestones: Milestone[] = milestones.map((m, idx) => ({
      id: `ms-${Date.now()}-${idx}`,
      projectId: '',
      orderIndex: idx + 1,
      title: m.title,
      description: m.description,
      targetDate: m.targetDate,
      budgetAllocatedPaise: rupeesToPaise(m.budgetRupees),
      status: idx === 0 ? 'in_progress' : 'upcoming',
    }));

    const newProj = createProject({
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      problemStatement: problemStatement.trim(),
      proposedSolution: proposedSolution.trim(),
      category,
      targetAmountPaise: targetPaise,
      completionDate,
      institution: institution.trim(),
      status: 'published',
      images: [imageUrl],
      budgetBreakdown: formattedBudget,
      creatorId: currentUser.id,
      creatorName: currentUser.fullName,
      creatorAvatar: currentUser.avatarUrl,
      milestones: formattedMilestones,
    });

    router.push(`/projects/${newProj.id}`);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Create Innovation Project</h1>
          <p className="text-xs text-slate-400">
            Publish your student engineering prototype or robotics project to raise funds with PayPal Sandbox
          </p>
        </div>

        {/* Gemini AI Proposal Generator Card */}
        <div className="p-6 rounded-3xl border border-violet-200 dark:border-violet-500/30 bg-gradient-to-r from-violet-50 via-purple-50/70 to-indigo-50 dark:from-violet-950/30 dark:via-slate-900 dark:to-indigo-950/20 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-violet-600 dark:text-violet-400">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              AI Project Proposal Generator (Powered by Gemini 2.5)
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Enter a short project idea (e.g. &ldquo;Autonomous Solar Panel Cleaning Drone&rdquo; or &ldquo;Non-Invasive Glucose Patch&rdquo;) and Gemini will formulate a comprehensive technical problem statement, BOM budget, and milestone roadmap.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Enter prototype idea or innovation topic..."
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={handleGeminiGenerate}
              disabled={isGeneratingAi || !aiTopic.trim()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 whitespace-nowrap flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Full Proposal</span>
                </>
              )}
            </button>
          </div>

          {isAiMock && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Demo data — no API key configured</span>
            </div>
          )}

          {aiNotice && (
            <p className="text-xs text-violet-300 font-medium flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {aiNotice}
            </p>
          )}
        </div>

        {/* Project Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              1. Basic Project Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. AgriBot: Autonomous Agricultural Robot"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  University / College / Institution *
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Short Description (1-2 sentences) *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Brief summary of your prototype for project cards"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Funding Target (₹ INR) *
                </label>
                <input
                  type="number"
                  step="1000"
                  min="1000"
                  required
                  value={targetAmountRupees}
                  onChange={(e) => setTargetAmountRupees(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Expected Completion Date *
                </label>
                <input
                  type="date"
                  required
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              2. Technical Problem & Solution
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Problem Statement *
              </label>
              <textarea
                rows={3}
                required
                placeholder="What real-world engineering challenge or inefficiency does your project address?"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Proposed Technical Solution *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explain the hardware architecture, algorithms, and prototype mechanics."
                value={proposedSolution}
                onChange={(e) => setProposedSolution(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">3. Estimated Development Budget (BOM)</h3>
              <button
                type="button"
                onClick={() =>
                  setBudgetItems([...budgetItems, { item: 'New Component', amountRupees: '10000' }])
                }
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {budgetItems.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={b.item}
                    onChange={(e) => {
                      const updated = [...budgetItems];
                      updated[idx].item = e.target.value;
                      setBudgetItems(updated);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs"
                    placeholder="Component name..."
                  />
                  <div className="relative w-36">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={b.amountRupees}
                      onChange={(e) => {
                        const updated = [...budgetItems];
                        updated[idx].amountRupees = e.target.value;
                        setBudgetItems(updated);
                      }}
                      className="w-full pl-6 pr-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setBudgetItems(budgetItems.filter((_, i) => i !== idx))}
                    className="p-1.5 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Development Milestones */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">4. Milestone Roadmap</h3>
              <button
                type="button"
                onClick={() =>
                  setMilestones([
                    ...milestones,
                    {
                      title: `Phase ${milestones.length + 1}: Next Deliverable`,
                      description: 'Milestone scope and test deliverables.',
                      targetDate: '2026-12-31',
                      budgetRupees: '50000',
                    },
                  ])
                }
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => {
                        const up = [...milestones];
                        up[idx].title = e.target.value;
                        setMilestones(up);
                      }}
                      className="flex-1 font-bold text-xs text-white bg-transparent border-b border-slate-800 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setMilestones(milestones.filter((_, i) => i !== idx))}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={m.description}
                    onChange={(e) => {
                      const up = [...milestones];
                      up[idx].description = e.target.value;
                      setMilestones(up);
                    }}
                    placeholder="Deliverable description..."
                    className="w-full text-xs text-slate-400 bg-transparent focus:outline-none"
                  />
                  <div className="flex items-center justify-between text-xs pt-1">
                    <input
                      type="date"
                      value={m.targetDate}
                      onChange={(e) => {
                        const up = [...milestones];
                        up[idx].targetDate = e.target.value;
                        setMilestones(up);
                      }}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">Allocated: ₹</span>
                      <input
                        type="number"
                        value={m.budgetRupees}
                        onChange={(e) => {
                          const up = [...milestones];
                          up[idx].budgetRupees = e.target.value;
                          setMilestones(up);
                        }}
                        className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-violet-600/30 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Rocket className="w-4 h-4" />
              <span>Publish Innovation Project</span>
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
