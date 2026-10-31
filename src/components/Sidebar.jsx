import React from 'react';
import { 
  LayoutDashboard, 
  Bell, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  RotateCcw, 
  X,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  stats, 
  onResetData, 
  mobileOpen, 
  setMobileOpen 
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'all-notices',
      label: 'All Notices',
      icon: Bell,
      badge: stats.total
    },
    {
      id: 'calendar',
      label: 'Event Calendar',
      icon: CalendarIcon,
      badge: stats.upcoming
    },
    {
      id: 'ai-summary',
      label: 'AI Summary',
      icon: Sparkles,
      badge: 'Digest',
      badgeColor: 'bg-pulse-purple/30 text-pulse-glow border border-pulse-purple/40'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-navy-900/95 border-r border-purple-500/15
        flex flex-col backdrop-blur-xl transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pulse-cyan p-0.5 shadow-glow-purple">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-pulse-glow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">Campus Pulse</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <p className="text-xs text-purple-300/70 font-medium">Smart College Notice Hub</p>
            </div>
          </div>
          
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Mode Badge */}
        <div className="px-5 pt-4">
          <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/20 flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-purple-200">DEMO EXTRACTION ACTIVE</p>
              <p className="text-[10px] text-purple-300/60 leading-tight">No API Key Required (Rule Engine)</p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              v1.0
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400/80 px-3 mb-2">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/10 text-white border border-purple-500/40 shadow-glow-purple' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-pulse-glow' : 'text-slate-400 group-hover:text-purple-300'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || (isActive ? 'bg-purple-500 text-white' : 'bg-navy-800 text-slate-400')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Reset Actions */}
        <div className="p-4 border-t border-white/5 space-y-3 bg-navy-950/40">
          <button
            onClick={onResetData}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-400 hover:text-purple-300 rounded-lg hover:bg-purple-950/30 border border-transparent hover:border-purple-500/20 transition-all"
            title="Reset to default college notices"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Notices</span>
          </button>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-navy-800/60 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              AC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Alex Chen</p>
              <p className="text-[10px] text-slate-400 truncate">Computer Science &bull; Batch 2027</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
