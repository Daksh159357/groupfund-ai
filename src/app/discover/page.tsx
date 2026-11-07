'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { formatPaise } from '@/lib/financial';
import { ProjectCategory } from '@/types';
import {
  Search,
  Filter,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Cpu,
  Sparkles,
  Rocket,
} from 'lucide-react';

const CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
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

export default function DiscoverProjectsPage() {
  const { projects } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProjectCategory>('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'funded'>('popular');

  const filteredProjects = projects.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      p.institution.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="relative rounded-3xl border border-violet-200 dark:border-slate-800 bg-gradient-to-r from-violet-50 via-indigo-50/70 to-purple-50 dark:from-violet-950/40 dark:via-slate-900 dark:to-indigo-950/30 p-6 sm:p-8 overflow-hidden shadow-sm">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/15 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Engineering & Robotics Innovation Crowdfunding</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Discover Groundbreaking Prototypes
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Back engineering student teams turning laboratory inventions into verified real-world hardware.
              </p>
            </div>

            <Link
              href="/projects/create"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all active:scale-[0.98] self-start sm:self-auto"
            >
              <Rocket className="w-4 h-4" />
              <span>Launch Your Project</span>
            </Link>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, technology, or institution..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-600 dark:text-slate-400">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none shadow-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="funded">% Funded</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Category Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const progress = Math.min(
              100,
              Math.round((project.raisedAmountPaise / project.targetAmountPaise) * 100)
            );

            return (
              <div
                key={project.id}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden flex flex-col justify-between group hover:border-violet-400 dark:hover:border-slate-700 transition-all shadow-md shadow-slate-200/50 dark:shadow-xl dark:shadow-black/20"
              >
                <div>
                  <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={project.images[0] || '/images/aeroclean.jpg'}
                      alt={project.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/aeroclean.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-white">
                      <span>{project.category}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-[11px] text-slate-200">
                      <img
                        src={project.creatorAvatar}
                        alt=""
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="truncate">{project.institution}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {formatPaise(project.raisedAmountPaise)}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {progress}% of {formatPaise(project.targetAmountPaise)}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{project.milestones.length} Milestones</span>
                      <span>Target: {new Date(project.completionDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/projects/${project.id}`}
                    className="w-full py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 dark:bg-violet-600/20 dark:hover:bg-violet-600/30 text-violet-700 dark:text-violet-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-violet-200 dark:border-transparent"
                  >
                    <span>View Prototype & Back via PayPal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
