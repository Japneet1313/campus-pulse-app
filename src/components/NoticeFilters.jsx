import React from 'react';
import { Filter, X, Bookmark, AlertTriangle, CalendarClock } from 'lucide-react';
import { NOTICE_CATEGORIES, NOTICE_PRIORITIES } from '../data/sampleNotices';

export default function NoticeFilters({
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  resultCount,
  onResetFilters
}) {
  const isFiltered = selectedCategory !== 'All' || selectedPriority !== 'All' || statusFilter !== 'all' || Boolean(dateFilter);

  return (
    <div className="space-y-3.5 mb-6">
      {/* Category Horizontal Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {NOTICE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150
                ${isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple border border-purple-400/40'
                  : 'bg-navy-900/80 text-slate-400 hover:text-slate-200 hover:bg-navy-800/80 border border-white/5'}
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sub Filters: Priority, Status, Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Buttons */}
          <div className="inline-flex rounded-xl p-1 bg-navy-900 border border-white/5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'upcoming' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setStatusFilter('pinned')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'pinned' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              Pinned
            </button>
            <button
              onClick={() => setStatusFilter('expired')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'expired' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Past
            </button>
          </div>

          {/* Priority Select */}
          <div className="flex items-center gap-1.5 bg-navy-900 border border-white/5 rounded-xl px-2.5 py-1 text-slate-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {NOTICE_PRIORITIES.map((p) => (
                <option key={p} value={p} className="bg-navy-950 text-white">
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Date Filter */}
          <div className="flex items-center gap-1.5 bg-navy-900 border border-white/5 rounded-xl px-2.5 py-1 text-slate-300">
            <CalendarClock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Date:</span>
            <input
              type="date"
              value={dateFilter || ''}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-xs text-slate-400 hover:text-white px-1"
                title="Clear date filter"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Counter & Clear Filter */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium">
            Showing <strong className="text-white">{resultCount}</strong> notice{resultCount === 1 ? '' : 's'}
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
