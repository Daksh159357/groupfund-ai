'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import {
  User,
  Mail,
  GraduationCap,
  Sparkles,
  Camera,
  CheckCircle2,
  Shield,
  Layers,
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useApp();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [areaOfInterest, setAreaOfInterest] = useState(currentUser.areaOfInterest || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [isSaved, setIsSaved] = useState(false);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      fullName,
      email,
      institution,
      areaOfInterest,
      avatarUrl,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">User Profile & Onboarding</h1>
          <p className="text-xs text-slate-400">
            A single unified identity for group expense sharing and student innovation crowdfunding
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar card */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={avatarUrl}
                alt=""
                className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500/50"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <p className="text-xs font-semibold text-slate-300">Choose Profile Photo</p>
              <div className="flex items-center gap-2">
                {sampleAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                      avatarUrl === url ? 'border-blue-500 scale-110' : 'border-slate-800 opacity-60'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Or paste custom image URL..."
                className="w-full px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-[11px]"
              />
            </div>
          </div>

          {/* Identity details */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Account Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  College or Institution (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. IIT Bombay, BITS Pilani"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Area of Interest (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Robotics, AI, CleanTech, Autonomous Vehicles"
                  value={areaOfInterest}
                  onChange={(e) => setAreaOfInterest(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Unified Role Explanation (Section 4 Requirement) */}
          <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-950/20 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Multi-Role Capability</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In GroupFund AI, you do not need to lock into a single role. You can simultaneously act as a group organizer, a trip participant splitting bills, a student innovator raising prototype funds, and a community backer!
            </p>
          </div>

          {isSaved && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
