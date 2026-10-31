import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Zap, 
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function WeeklyDigestModal({ 
  isOpen, 
  onClose, 
  notices, 
  referenceDate = '2026-10-31', 
  onSelectDate, 
  onViewDetails 
}) {
  const [copied, setCopied] = useState(false);
  const [checkedActions, setCheckedActions] = useState({});

  if (!isOpen) return null;

  // Calculate 7-day window from referenceDate (e.g., 2026-10-31 to 2026-11-07)
  const refParts = referenceDate.split('-').map(Number);
  const startDate = new Date(refParts[0], refParts[1] - 1, refParts[2]);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7);

  const startIso = referenceDate;
  const endIso = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

  // Filter notices for this week
  const weekNotices = notices.filter(n => {
    if (!n.date || n.date === 'Not specified') return false;
    const cleanDate = n.date.split('T')[0];
    return cleanDate >= startIso && cleanDate <= endIso;
  }).sort((a, b) => a.date.localeCompare(b.date));

  const urgentNotices = weekNotices.filter(n => n.priority?.toLowerCase() === 'urgent');
  const actionItems = weekNotices.filter(n => n.actionRequired);

  const toggleAction = (id) => {
    setCheckedActions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleCopy = () => {
    const lines = [
      `📅 CAMPUS PULSE - WEEKLY DIGEST`,
      `Period: ${startIso} to ${endIso}`,
      `Total Scheduled: ${weekNotices.length} events (${urgentNotices.length} urgent)`,
      "",
      "⚡ TOP ACTION ITEMS FOR THIS WEEK:",
      ...actionItems.map(a => `- [${a.date}] ${a.actionRequired} (Notice: ${a.title})`),
      "",
      "📌 CHRONOLOGICAL EVENTS:",
      ...weekNotices.map(n => `- ${n.date} (${n.time || 'All Day'}): ${n.title} @ ${n.venue || 'Campus'} [Priority: ${n.priority}]`),
      "",
      "Generated from Campus Pulse Student Hub"
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-navy-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-purple-500/15 bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-navy-900 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pulse-cyan text-white shadow-glow-purple shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  What You Need to Know This Week
                </h3>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-pulse-glow border border-purple-500/30">
                  Weekly Intelligence
                </span>
              </div>
              <p className="text-xs text-purple-300/80 mt-1">
                Active window: <strong className="text-white">{formatDateDisplay(startIso)}</strong> &rarr; <strong className="text-white">{formatDateDisplay(endIso)}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors shrink-0"
            aria-label="Close weekly digest"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-3 border-b border-white/5 bg-navy-950/60 divide-x divide-white/5 text-center py-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Scheduled</span>
            <span className="text-base sm:text-lg font-bold text-white">{weekNotices.length} Notices</span>
          </div>
          <div>
            <span className="text-xs text-rose-400 block font-medium">Urgent Actions</span>
            <span className="text-base sm:text-lg font-bold text-rose-300">{urgentNotices.length} Critical</span>
          </div>
          <div>
            <span className="text-xs text-purple-400 block font-medium">Action Items</span>
            <span className="text-base sm:text-lg font-bold text-purple-300">{actionItems.length} Tasks</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Action Items Section */}
          {actionItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Immediate Action Tasks Due This Week</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  {Object.values(checkedActions).filter(Boolean).length} of {actionItems.length} checked
                </span>
              </div>

              <div className="space-y-2">
                {actionItems.map((item) => {
                  const isChecked = !!checkedActions[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleAction(item.id)}
                      className={`
                        p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3
                        ${isChecked 
                          ? 'bg-navy-950/30 border-white/5 opacity-60 line-through text-slate-500' 
                          : 'bg-navy-950/80 border-purple-500/20 hover:border-purple-400/40 text-slate-200'}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded border-purple-500/40 text-purple-600 focus:ring-0 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white">
                            {item.actionRequired}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {formatDateDisplay(item.date)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          Notice: {item.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chronological Notices for the week */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Events & Circulars in Next 7 Days</span>
            </h4>

            {weekNotices.length > 0 ? (
              <div className="space-y-3">
                {weekNotices.map((notice) => {
                  const isUrgent = notice.priority?.toLowerCase() === 'urgent';
                  return (
                    <div
                      key={notice.id}
                      className="p-4 rounded-xl bg-navy-950/80 border border-purple-500/15 hover:border-purple-400/40 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {notice.category}
                          </span>
                          {isUrgent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                              URGENT
                            </span>
                          )}
                          <span className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {formatDateDisplay(notice.date)} &bull; {notice.time || '10:00 AM'}
                          </span>
                        </div>

                        <h5 
                          onClick={() => {
                            if (onViewDetails) onViewDetails(notice);
                            onClose();
                          }}
                          className="text-sm font-bold text-white group-hover:text-purple-300 cursor-pointer transition-colors"
                        >
                          {notice.title}
                        </h5>

                        {notice.venue && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span className="truncate">{notice.venue}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => {
                            onSelectDate(notice.date);
                            onClose();
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-all"
                        >
                          <span>Go to Date</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                No events or circulars scheduled in this 7-day window.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-500/15 bg-navy-950/70 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Auto-synthesized from saved notices in your local system.
          </p>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-navy-800 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Digest Copied!' : 'Copy Weekly Digest'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-purple transition-all"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
