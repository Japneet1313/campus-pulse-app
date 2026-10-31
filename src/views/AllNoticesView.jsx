import React, { useState } from 'react';
import NoticeFilters from '../components/NoticeFilters';
import NoticeCard from '../components/NoticeCard';
import { ArrowUpDown, SearchX, PlusCircle } from 'lucide-react';

export default function AllNoticesView({
  notices,
  searchQuery,
  onViewDetails,
  onTogglePin,
  onToggleRead,
  onDelete,
  onEdit,
  onOpenNewNotice
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filter notices
  const filtered = notices.filter((item) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchVenue = item.venue?.toLowerCase().includes(q);
      const matchSummary = item.summary?.toLowerCase().includes(q);
      const matchTags = item.tags?.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchVenue && !matchSummary && !matchTags) {
        return false;
      }
    }

    // Category
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    // Priority
    if (selectedPriority !== 'All' && item.priority !== selectedPriority) {
      return false;
    }

    // Specific Date filter
    if (dateFilter && item.date !== dateFilter) {
      return false;
    }

    // Status Filter
    if (statusFilter === 'pinned' && !item.isPinned) return false;
    if (statusFilter === 'upcoming' && item.date && item.date < '2026-10-31') return false;
    if (statusFilter === 'expired' && (!item.date || item.date >= '2026-10-31')) return false;

    return true;
  });

  // Sort notices
  const sorted = [...filtered].sort((a, b) => {
    // Pinned notices stay on top
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }

    if (sortBy === 'date-asc') {
      return (a.date || '').localeCompare(b.date || '');
    } else if (sortBy === 'date-desc') {
      return (b.date || '').localeCompare(a.date || '');
    } else if (sortBy === 'priority') {
      const weight = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      return (weight[b.priority] || 0) - (weight[a.priority] || 0);
    }
    return 0;
  });

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedPriority('All');
    setStatusFilter('all');
    setDateFilter('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Filters Bar */}
      <NoticeFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        resultCount={sorted.length}
        onResetFilters={handleResetFilters}
      />

      {/* Sorting bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
        <span>Organized by pinned notices, followed by selected sort order</span>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-navy-900 border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="date-desc">Event Date (Latest First)</option>
            <option value="date-asc">Event Date (Earliest First)</option>
            <option value="priority">Priority (Urgent &rarr; Low)</option>
          </select>
        </div>
      </div>

      {/* Notices Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((notice) => (
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
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl bg-navy-900/40 border border-purple-500/15 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 mx-auto flex items-center justify-center mb-4">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No notices match your criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, removing active category filters, or add a new circular.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-navy-800 text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenNewNotice}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Notice</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
