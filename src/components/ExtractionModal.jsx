import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Tag, 
  Layers, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { NOTICE_CATEGORIES, NOTICE_PRIORITIES } from '../data/sampleNotices';

export default function ExtractionModal({ extractedData, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    priority: 'Medium',
    date: '2026-11-05',
    time: '10:00 AM',
    venue: '',
    actionRequired: '',
    summary: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const isEditMode = Boolean(extractedData?.id);

  useEffect(() => {
    if (extractedData) {
      setFormData({
        id: extractedData.id || undefined,
        title: extractedData.title || '',
        category: extractedData.category || 'Academic',
        priority: extractedData.priority || 'Medium',
        date: extractedData.date || 'Not specified',
        time: extractedData.time || 'Not specified',
        venue: extractedData.venue || 'Not specified',
        actionRequired: extractedData.actionRequired || '',
        summary: extractedData.summary || '',
        tags: extractedData.tags || [],
        rawText: extractedData.rawText || ''
      });
    }
  }, [extractedData]);

  if (!isOpen || !extractedData) return null;

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tagToRemove)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-navy-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-purple-500/15 bg-gradient-to-r from-purple-900/30 via-navy-900 to-navy-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-pulse-glow border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {isEditMode ? 'Edit Campus Notice' : 'Extracted Notice Review'}
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {isEditMode ? 'Edit Mode' : 'Demo Parser'}
                </span>
              </div>
              <p className="text-xs text-purple-300/70">
                {isEditMode 
                  ? 'Update circular information and save changes to dashboard'
                  : 'Verify and refine extracted circular details before publishing to your dashboard'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Parser Notice */}
        <div className="px-6 py-2.5 bg-purple-950/40 border-b border-purple-500/10 flex items-center justify-between text-xs text-purple-300">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Rule-based extraction completed &bull; Review fields below
          </span>
          <span className="text-[11px] text-purple-300/60 font-mono">
            {extractedData.confidenceScore || 'Parsed'}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Notice Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-navy-950 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-navy-950 border border-purple-500/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
              >
                {NOTICE_CATEGORIES.filter(c => c !== 'All').map((cat) => (
                  <option key={cat} value={cat} className="bg-navy-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority Level *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-navy-950 border border-purple-500/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
              >
                {NOTICE_PRIORITIES.filter(p => p !== 'All').map((p) => (
                  <option key={p} value={p} className="bg-navy-900 text-white">
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Time, Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Event / Due Date
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="YYYY-MM-DD or Not specified"
                className="w-full bg-navy-950 border border-purple-500/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Time
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 10:00 AM"
                className="w-full bg-navy-950 border border-purple-500/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Venue / Platform
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. Seminar Hall"
                className="w-full bg-navy-950 border border-purple-500/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Action Required */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Action Required / Immediate Student Task
            </label>
            <input
              type="text"
              value={formData.actionRequired}
              onChange={(e) => setFormData({ ...formData, actionRequired: e.target.value })}
              placeholder="e.g. Download hall ticket from student portal before Nov 3"
              className="w-full bg-navy-950 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Executive Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Executive Summary
            </label>
            <textarea
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full bg-navy-950 border border-purple-500/20 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Tags (Press Enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag name and press Enter..."
              className="w-full bg-navy-950 border border-purple-500/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-glow-purple transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isEditMode ? 'Save Changes' : 'Publish to Campus Pulse'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
