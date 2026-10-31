import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Bookmark, 
  Share2, 
  Copy, 
  Check, 
  Trash2, 
  Zap, 
  FileText,
  ExternalLink,
  Edit3
} from 'lucide-react';

export default function NoticeDetailModal({ notice, isOpen, onClose, onTogglePin, onDelete, onEdit }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !notice) return null;

  const handleCopy = () => {
    const textToCopy = `[Campus Pulse] ${notice.title}\nCategory: ${notice.category}\nDate: ${notice.date} at ${notice.time}\nVenue: ${notice.venue}\nAction Required: ${notice.actionRequired || 'None'}\n\nSummary: ${notice.summary}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Campus Pulse: ${notice.title}`);
    const details = encodeURIComponent(`${notice.summary}\n\nVenue: ${notice.venue}\nAction: ${notice.actionRequired || ''}`);
    const location = encodeURIComponent(notice.venue || 'Campus');
    // Format date YYYYMMDD
    const cleanDate = notice.date ? notice.date.replace(/-/g, '') : '20261105';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${cleanDate}T090000Z/${cleanDate}T110000Z`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-navy-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-purple-500/15 bg-gradient-to-r from-purple-950/40 via-navy-900 to-navy-900 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {notice.category}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                notice.priority === 'Urgent' 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}>
                {notice.priority} Priority
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {notice.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-navy-950 border border-white/5 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Date</p>
                <p className="text-xs font-semibold text-slate-200">{notice.date || 'To be announced'}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-navy-950 border border-white/5 flex items-center gap-3">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Time</p>
                <p className="text-xs font-semibold text-slate-200">{notice.time || 'All Day'}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-navy-950 border border-white/5 flex items-center gap-3">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-500">Venue</p>
                <p className="text-xs font-semibold text-slate-200 truncate">{notice.venue || 'Campus'}</p>
              </div>
            </div>
          </div>

          {/* Action Required Box */}
          {notice.actionRequired && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-indigo-900/20 border border-purple-500/30 flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  Student Action Required
                </p>
                <p className="text-sm text-slate-200 mt-0.5 font-medium">
                  {notice.actionRequired}
                </p>
              </div>
            </div>
          )}

          {/* Executive Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Executive Summary
            </h4>
            <div className="p-4 rounded-xl bg-navy-950/80 border border-white/5 text-sm text-slate-300 leading-relaxed">
              {notice.summary}
            </div>
          </div>

          {/* Raw Text Accordion */}
          {notice.rawText && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                Original Announcement Text
              </h4>
              <div className="p-4 rounded-xl bg-navy-950/90 border border-white/5 text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {notice.rawText}
              </div>
            </div>
          )}

          {/* Tags */}
          {notice.tags && notice.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {notice.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-purple-500/15 bg-navy-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(notice);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={() => onTogglePin(notice.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                notice.isPinned
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-navy-900 text-slate-300 border-white/5 hover:bg-white/5'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${notice.isPinned ? 'fill-current' : ''}`} />
              <span>{notice.isPinned ? 'Pinned' : 'Pin Notice'}</span>
            </button>

            <button
              onClick={() => {
                onDelete(notice.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-navy-900 text-slate-300 border border-white/5 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple transition-all"
            >
              <span>Add to Google Calendar</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
