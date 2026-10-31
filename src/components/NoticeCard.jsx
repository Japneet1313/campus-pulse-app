import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Bookmark, 
  CheckCircle2, 
  Trash2, 
  ExternalLink, 
  Zap,
  Tag,
  AlertCircle,
  Edit3
} from 'lucide-react';

export default function NoticeCard({ 
  notice, 
  onViewDetails, 
  onTogglePin, 
  onToggleRead, 
  onDelete,
  onEdit
}) {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Exams':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Placements':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Events':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Sports':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Academic':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'Clubs':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600/30';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-glow-rose">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
            URGENT
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            HIGH
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700/30 text-slate-400 border border-slate-700/50">
            LOW
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'Not specified') return 'Not specified';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const isExpired = notice.date && notice.date !== 'Not specified' && notice.date < '2026-10-31';

  return (
    <div className={`
      group relative rounded-2xl bg-navy-900/70 border border-purple-500/15 p-5
      backdrop-blur-md transition-all duration-200 glass-card-hover flex flex-col justify-between
      ${notice.isPinned ? 'border-purple-400/50 ring-1 ring-purple-500/20 shadow-glow-purple' : ''}
      ${isExpired ? 'opacity-75 grayscale-[25%]' : ''}
    `}>
      {/* Card Header: Category & Priority */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${getCategoryColor(notice.category)}`}>
              {notice.category}
            </span>
            {getPriorityBadge(notice.priority)}
            {isExpired && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Past
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(notice)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                title="Edit notice"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onTogglePin(notice.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                notice.isPinned 
                  ? 'text-purple-400 bg-purple-500/20' 
                  : 'text-slate-500 hover:text-purple-300 hover:bg-white/5'
              }`}
              title={notice.isPinned ? "Unpin notice" : "Pin to top"}
            >
              <Bookmark className={`w-4 h-4 ${notice.isPinned ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => onDelete(notice.id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete notice"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onViewDetails(notice)}
          className="text-base sm:text-lg font-bold text-white group-hover:text-purple-200 cursor-pointer transition-colors leading-snug line-clamp-2"
        >
          {notice.title}
        </h3>

        {/* Key Info: Date, Time, Venue */}
        <div className="mt-3.5 space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="font-medium text-slate-200">{formatDate(notice.date)}</span>
            {notice.time && (
              <>
                <span className="text-slate-600">&bull;</span>
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{notice.time}</span>
              </>
            )}
          </div>

          {notice.venue && (
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{notice.venue}</span>
            </div>
          )}
        </div>

        {/* Summary Snippet */}
        <p className="mt-3 text-xs text-slate-400 leading-relaxed line-clamp-2">
          {notice.summary}
        </p>

        {/* Action item pill if present */}
        {notice.actionRequired && notice.actionRequired !== 'Not specified' && (
          <div className="mt-3 p-2 rounded-lg bg-purple-950/40 border border-purple-500/20 flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-purple-200 font-medium line-clamp-1">
              {notice.actionRequired}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {notice.tags && notice.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-[10px] text-slate-400 bg-navy-800/80 px-2 py-0.5 rounded border border-white/5 truncate">
              #{tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onViewDetails(notice)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors shrink-0"
        >
          <span>Details</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
