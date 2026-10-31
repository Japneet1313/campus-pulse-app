import React from 'react';
import StatsOverview from '../components/StatsOverview';
import SmartNoticeInput from '../components/SmartNoticeInput';
import NoticeCard from '../components/NoticeCard';
import { AlertTriangle, Sparkles, ArrowRight, BellRing, Layers } from 'lucide-react';

export default function DashboardView({
  notices,
  stats,
  onNoticeExtracted,
  onViewDetails,
  onTogglePin,
  onToggleRead,
  onDelete,
  onEdit,
  onNavigateToAll,
  onStatClick
}) {
  const urgentNotices = notices.filter(n => n.priority === 'Urgent');
  const recentNotices = notices.slice(0, 6);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Statistics Cards */}
      <section>
        <StatsOverview stats={stats} onStatClick={onStatClick} />
      </section>

      {/* 2. Smart Notice Input (Hero Extractor) */}
      <section>
        <SmartNoticeInput onNoticeExtracted={onNoticeExtracted} />
      </section>

      {/* 3. Urgent Notices Section (If any urgent exist) */}
      {urgentNotices.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Urgent Attention Required</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                </h2>
                <p className="text-xs text-rose-300/70">
                  Critical circulars with immediate deadlines or attendance requirements
                </p>
              </div>
            </div>

            <button
              onClick={() => onStatClick('urgent')}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <span>View all urgent ({urgentNotices.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgentNotices.slice(0, 2).map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onViewDetails={onViewDetails}
                onTogglePin={onTogglePin}
                onToggleRead={onToggleRead}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Recent Campus Notices */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-pulse-glow border border-purple-500/30">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Recent Circulars & Updates
              </h2>
              <p className="text-xs text-purple-300/70">
                Latest announcements published across departments
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToAll}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>See all notices ({notices.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onViewDetails={onViewDetails}
              onTogglePin={onTogglePin}
              onToggleRead={onToggleRead}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
