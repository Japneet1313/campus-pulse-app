import React from 'react';
import { 
  BellRing, 
  AlertTriangle, 
  CalendarCheck, 
  Clock, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';

export default function StatsOverview({ stats, onStatClick, activeFilter }) {
  const cards = [
    {
      id: 'all',
      title: 'Total Notices',
      count: stats.total,
      subtitle: 'Active circulars in system',
      icon: BellRing,
      gradient: 'from-purple-600/20 to-indigo-600/10',
      border: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-300',
      glow: 'hover:shadow-glow-purple',
      badge: 'Live'
    },
    {
      id: 'urgent',
      title: 'Urgent Notices',
      count: stats.urgent,
      subtitle: 'Requires immediate action',
      icon: AlertTriangle,
      gradient: 'from-rose-600/25 to-pink-600/10',
      border: 'border-rose-500/40',
      iconBg: 'bg-rose-500/20 text-rose-300',
      glow: 'hover:shadow-glow-rose',
      badge: 'High Priority',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/30'
    },
    {
      id: 'upcoming',
      title: 'Upcoming Events',
      count: stats.upcoming,
      subtitle: 'Scheduled from Nov 2026',
      icon: CalendarCheck,
      gradient: 'from-cyan-600/20 to-blue-600/10',
      border: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/20 text-cyan-300',
      glow: 'hover:shadow-glow-cyan',
      badge: 'Future'
    },
    {
      id: 'expired',
      title: 'Past / Expired',
      count: stats.expired,
      subtitle: 'Completed deadlines',
      icon: Clock,
      gradient: 'from-slate-700/20 to-slate-800/10',
      border: 'border-slate-700/40',
      iconBg: 'bg-slate-700/30 text-slate-400',
      glow: 'hover:border-slate-500',
      badge: 'Archived'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onStatClick && onStatClick(card.id)}
            className={`
              relative p-5 rounded-2xl bg-gradient-to-br ${card.gradient}
              border ${card.border} backdrop-blur-md cursor-pointer transition-all duration-200
              glass-card-hover ${card.glow}
              ${isSelected ? 'ring-2 ring-purple-400 scale-[1.02]' : ''}
            `}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ${card.iconBg} border border-white/5`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 ${
                card.badgeColor || 'text-slate-300 bg-navy-900/60'
              }`}>
                {card.badge}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {card.count}
                </span>
                <span className="text-xs text-slate-400 font-medium">items</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mt-1">
                {card.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {card.subtitle}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-purple-300/80 font-medium">
              <span>Filter view</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
