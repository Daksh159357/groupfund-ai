'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Shield,
  User,
  LogOut,
  CheckCircle2,
  Receipt,
  Layers,
} from 'lucide-react';
import { formatPaise } from '@/lib/financial';

export function Navbar() {
  const {
    currentUser,
    allUsers,
    setCurrentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    theme,
    toggleTheme,
    getUserBalanceSummary,
  } = useApp();

  const [isMounted, setIsMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.isRead);
  const balanceSummary = getUserBalanceSummary();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" id="tour-app-logo" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                GroupFund <span className="text-blue-500 font-extrabold">AI</span>
              </div>
              <div className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold hidden sm:block">
                Expenses &bull; Innovation Crowdfunding
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Balance Pill (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isMounted ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 text-xs">
              <span className="text-slate-400">Net Group Balance:</span>
              <span
                className={`font-semibold ${
                  balanceSummary.netPaise > 0
                    ? 'text-emerald-400'
                    : balanceSummary.netPaise < 0
                    ? 'text-amber-400'
                    : 'text-slate-300'
                }`}
              >
                {balanceSummary.netPaise > 0 ? '+' : ''}
                {formatPaise(balanceSummary.netPaise)}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {balanceSummary.netPaise >= 0 ? 'Receivable' : 'Owed'}
              </span>
            </div>
          ) : (
            <div className="h-7 w-48 rounded-full bg-slate-900/60 border border-slate-800 animate-pulse" />
          )}
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {isMounted && unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">Notifications</span>
                    {isMounted && unreadNotifs.length > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-400 font-bold">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead()}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 my-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">No notifications yet</div>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          setShowNotifMenu(false);
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                          !n.isRead ? 'bg-blue-950/20 hover:bg-blue-900/30' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                        {n.link && (
                          <Link href={n.link} className="text-[10px] text-blue-400 hover:underline mt-1 inline-block">
                            View details &rarr;
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 text-center">
                  <Link
                    href="/notifications"
                    onClick={() => setShowNotifMenu(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick User Switcher Dropdown (Interactive Pair Programming & Demo Feature) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-800 bg-slate-900 hover:border-slate-700 transition-colors"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-500/50"
              />
              <span className="text-xs font-medium text-slate-200 hidden sm:inline-block max-w-[100px] truncate">
                {currentUser.fullName}
              </span>
              {currentUser.role === 'admin' && (
                <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.5 rounded font-bold">
                  ADMIN
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-slate-800">
                  <p className="text-xs font-semibold text-white">{currentUser.fullName}</p>
                  <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                  <p className="text-[10px] text-blue-400 font-medium mt-0.5">
                    {currentUser.institution || 'Independent Innovator'} &bull; {currentUser.areaOfInterest}
                  </p>
                </div>

                {/* Role Switcher for Hackathon Testing */}
                <div className="py-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1.5">
                    Switch Test Account:
                  </p>
                  <div className="space-y-1">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          user.id === currentUser.id
                            ? 'bg-blue-600/20 text-blue-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={user.avatarUrl}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="truncate">{user.fullName}</span>
                        </div>
                        {user.role === 'admin' ? (
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 rounded">Admin</span>
                        ) : (
                          user.id === currentUser.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800/60"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    My Profile
                  </Link>
                  {currentUser.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-purple-300 hover:bg-purple-950/40"
                    >
                      <Shield className="w-3.5 h-3.5 text-purple-400" />
                      Admin Control Panel
                    </Link>
                  )}
                  <Link
                    href="/"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    Sign Out (Demo Landing)
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
