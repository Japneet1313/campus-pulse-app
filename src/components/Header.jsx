import React from 'react';
import { 
  Menu, 
  Search, 
  PlusCircle, 
  Bell, 
  Calendar,
  Sparkles,
  Command
} from 'lucide-react';

export default function Header({ 
  onMenuToggle, 
  searchQuery, 
  setSearchQuery, 
  onOpenNewNotice, 
  currentView,
  urgentCount 
}) {
  const getHeading = () => {
    switch (currentView) {
      case 'dashboard':
        return { title: 'Campus Dashboard', subtitle: 'Live circulars, placement updates & exam alerts' };
      case 'all-notices':
        return { title: 'All Campus Notices', subtitle: 'Search, filter, and archive college circulars' };
      case 'calendar':
        return { title: 'Academic & Event Calendar', subtitle: 'Upcoming deadlines, drives, and fests' };
      case 'ai-summary':
        return { title: 'Daily AI Briefing', subtitle: 'Automated executive summary and action items' };
      default:
        return { title: 'Campus Pulse', subtitle: 'Student Information System' };
    }
  };

  const { title, subtitle } = getHeading();

  return (
    <header className="sticky top-0 z-30 bg-navy-950/80 backdrop-blur-xl border-b border-purple-500/10 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 focus:outline-none"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              {title}
            </h1>
            <p className="hidden sm:block text-xs text-purple-300/70">{subtitle}</p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-pulse-glow transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars, exams, placements..."
              className="w-full bg-navy-900/80 border border-purple-500/20 rounded-xl pl-10 pr-10 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-pulse-glow/60 focus:ring-1 focus:ring-pulse-glow/30 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Date, Urgent Alert Bell & Quick Action */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900/60 border border-white/5 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Oct 31, 2026</span>
          </div>

          {urgentCount > 0 && (
            <div 
              className="relative p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 cursor-pointer hover:bg-rose-500/20 transition-colors"
              title={`${urgentCount} urgent notices require your attention`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {urgentCount}
              </span>
            </div>
          )}

          <button
            onClick={onOpenNewNotice}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-glow-purple transition-all duration-200 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add Notice</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  );
}
