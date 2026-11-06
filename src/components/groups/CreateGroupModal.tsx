'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Users, Image as ImageIcon, Sparkles } from 'lucide-react';

export function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const { createGroup } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleImages = [
    { label: 'Trip & Travel', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
    { label: 'Robotics & Lab', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800' },
    { label: 'Hostel & Food', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
    { label: 'College Fest', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    const chosenImage = imageUrl || sampleImages[0].url;
    createGroup(name.trim(), description.trim(), chosenImage);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Create New Group</h2>
            <p className="text-xs text-slate-400">Manage shared expenses for trips, labs, hackathons, or dinners</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Group Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Goa Trip 2026, Robotics Lab, Hostel Flat 402"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="What will this group track?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cover Image (Pick a preset or enter URL)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {sampleImages.map((img) => (
                <button
                  type="button"
                  key={img.label}
                  onClick={() => setImageUrl(img.url)}
                  className={`relative rounded-xl overflow-hidden border p-1 text-left transition-all ${
                    imageUrl === img.url ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-12 object-cover rounded-lg" />
                  <span className="block text-[10px] text-slate-300 font-medium mt-1 truncate">{img.label}</span>
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="Or paste custom image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
