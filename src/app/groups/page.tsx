'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { formatPaise } from '@/lib/financial';
import { Users, PlusCircle, UserPlus, Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
import { CreateGroupModal } from '@/components/groups/CreateGroupModal';
import { JoinGroupModal } from '@/components/groups/JoinGroupModal';

export default function GroupsPage() {
  const { groups, currentUser } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">My Expense Groups</h1>
            <p className="text-xs text-slate-400">
              Manage shared costs for trips, hostel living, labs, and college fests
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowJoin(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Join via Code</span>
            </button>

            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Group</span>
            </button>
          </div>
        </div>

        {/* Group Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            const isUserMember = group.members.some((m) => m.userId === currentUser.id);

            return (
              <div
                key={group.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all shadow-lg shadow-black/20"
              >
                <div>
                  <div className="h-40 relative overflow-hidden bg-slate-800">
                    <img
                      src={group.imageUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'}
                      alt={group.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-mono font-bold text-slate-200">
                      <span>{group.inviteCode}</span>
                      <button
                        onClick={() => copyCode(group.inviteCode)}
                        className="hover:text-blue-400 transition-colors"
                        title="Copy invite code"
                      >
                        {copiedCode === group.inviteCode ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h2 className="font-bold text-base text-white">{group.name}</h2>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {group.description || 'Shared expense tracking'}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>{group.members.length} members</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Total Spent</span>
                        <span className="font-mono font-bold text-white">
                          {formatPaise(group.totalSpentPaise)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/groups/${group.id}`}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Open Group Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
      {showJoin && <JoinGroupModal onClose={() => setShowJoin(false)} />}
    </AppLayout>
  );
}
