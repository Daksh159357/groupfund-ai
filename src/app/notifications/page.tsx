'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  CheckCircle2,
  Users,
  Receipt,
  Scale,
  Lightbulb,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications Center</h1>
            <p className="text-xs text-slate-400">
              Live updates on expense splits, debt settlements, and innovation milestones
            </p>
          </div>

          <button
            onClick={() => markAllNotificationsRead()}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-colors self-start sm:self-auto"
          >
            Mark All as Read
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'unread'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Unread ({notifications.filter((n) => !n.isRead).length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-500">
              No notifications to display.
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-5 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                  !n.isRead ? 'bg-blue-950/20 hover:bg-blue-900/30' : 'hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-white">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
                    {n.link && (
                      <Link
                        href={n.link}
                        className="text-[11px] text-blue-400 hover:underline mt-1.5 inline-flex items-center gap-1 font-semibold"
                      >
                        <span>View item</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 shrink-0 whitespace-nowrap">
                  {new Date(n.createdAt).toLocaleString([], {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
