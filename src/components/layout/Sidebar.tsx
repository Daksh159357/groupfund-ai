'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Lightbulb,
  Compass,
  ArrowLeftRight,
  Bot,
  Scale,
  Bell,
  User,
  Settings,
  ShieldAlert,
  PlusCircle,
  Rocket,
  UserPlus,
  Presentation,
} from 'lucide-react';
import { CreateGroupModal } from '@/components/groups/CreateGroupModal';
import { JoinGroupModal } from '@/components/groups/JoinGroupModal';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, notifications } = useApp();
  const [isMounted, setIsMounted] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  interface NavLinkItem {
    label: string;
    href: string;
    icon: any;
    id?: string;
    badge?: string;
    count?: number;
  }

  const navLinks: NavLinkItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Groups', href: '/groups', icon: Users, id: 'tour-my-groups' },
    { label: 'Expenses', href: '/expenses', icon: Receipt },
    { label: 'Innovation Projects', href: '/projects/manage', icon: Lightbulb },
    { label: 'Discover Projects', href: '/discover', icon: Compass, id: 'tour-discover-projects' },
    { label: 'Payments & Transactions', href: '/transactions', icon: ArrowLeftRight },
    { label: 'AI Assistant', href: '/ai-assistant', icon: Bot, badge: 'Gemini', id: 'tour-ai-assistant' },
    { label: 'Settlements', href: '/settlements', icon: Scale },
    { label: 'Notifications', href: '/notifications', icon: Bell, count: unreadNotifs },
    { label: 'Pitch Deck Slides', href: '/slides', icon: Presentation, badge: 'Deck' },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  if (isMounted && currentUser.role === 'admin') {
    navLinks.push({ label: 'Admin Dashboard', href: '/admin', icon: ShieldAlert, badge: 'Admin' });
  }

  return (
    <>
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl flex flex-col justify-between p-4 shrink-0 hidden lg:flex min-h-[calc(100vh-57px)]">
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              id="tour-new-group-btn"
              onClick={() => setShowCreateGroup(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Group</span>
            </button>

            <Link
              href="/projects/create"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-violet-300 dark:border-violet-500/40 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 font-medium text-xs transition-all active:scale-[0.98]"
            >
              <Rocket className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>Fund Innovation Project</span>
            </Link>

            <button
              onClick={() => setShowJoinGroup(true)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-[11px] transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Join Group via Invite Code</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
              Menu Navigation
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  id={item.id}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 font-semibold">
                      {item.badge}
                    </span>
                  )}
                  {isMounted && item.count ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500 text-white font-bold">
                      {item.count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-center gap-3">
            <img
              src={currentUser.avatarUrl}
              alt=""
              className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-500/50"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{currentUser.fullName}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser.institution || 'Innovator'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Global Modals */}
      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
      {showJoinGroup && <JoinGroupModal onClose={() => setShowJoinGroup(false)} />}
    </>
  );
}
