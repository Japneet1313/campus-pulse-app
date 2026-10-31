import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
  Filter,
  CheckCircle2,
  CalendarCheck2,
  ArrowRight
} from 'lucide-react';
import WeeklyDigestModal from '../components/WeeklyDigestModal';

const TODAY_DATE = '2026-10-31';

export default function CalendarView({ notices = [], onViewDetails }) {
  // Calendar state: Initialized to November 2026 where primary semester notices exist
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed: 10 is November
  const [selectedDateStr, setSelectedDateStr] = useState('2026-11-05');

  // Filter state for Agenda
  const [agendaScope, setAgendaScope] = useState('selected'); // 'selected' | 'month' | 'upcoming'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'urgent' | 'today' | 'upcoming' | 'expired'
  
  // Weekly Digest Modal state
  const [isWeeklyDigestOpen, setIsWeeklyDigestOpen] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper to normalize any date string to YYYY-MM-DD
  const normalizeDate = (d) => {
    if (!d || d === 'Not specified') return null;
    const match = String(d).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (match) {
      return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
    }
    return null;
  };

  // Helper for automatic priority/status detection
  const getNoticeStatus = (notice) => {
    const cleanDate = normalizeDate(notice.date);
    const isToday = cleanDate === TODAY_DATE;
    const isUrgent = notice.priority?.toLowerCase() === 'urgent';
    const isPast = cleanDate && cleanDate < TODAY_DATE;
    const isUpcoming = cleanDate && cleanDate > TODAY_DATE;

    let primaryStatus = 'upcoming';
    if (isToday) primaryStatus = 'today';
    else if (isUrgent) primaryStatus = 'urgent';
    else if (isPast) primaryStatus = 'expired';

    return {
      isToday,
      isUrgent,
      isPast,
      isUpcoming,
      primaryStatus
    };
  };

  // Map notices by normalized date string YYYY-MM-DD
  const noticesByDate = useMemo(() => {
    const map = {};
    notices.forEach(n => {
      const clean = normalizeDate(n.date);
      if (clean) {
        if (!map[clean]) map[clean] = [];
        map[clean].push(n);
      }
    });
    return map;
  }, [notices]);

  // Days in month calculation
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear = currentYear - 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);

    // Automatically select the first date with notices in that month, or 1st of month
    const mStr = String(newMonth + 1).padStart(2, '0');
    const prefix = `${newYear}-${mStr}-`;
    const noticeInMonth = notices.find(n => {
      const clean = normalizeDate(n.date);
      return clean && clean.startsWith(prefix);
    });

    if (noticeInMonth) {
      setSelectedDateStr(normalizeDate(noticeInMonth.date));
    } else {
      setSelectedDateStr(`${prefix}01`);
    }
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear = currentYear + 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);

    const mStr = String(newMonth + 1).padStart(2, '0');
    const prefix = `${newYear}-${mStr}-`;
    const noticeInMonth = notices.find(n => {
      const clean = normalizeDate(n.date);
      return clean && clean.startsWith(prefix);
    });

    if (noticeInMonth) {
      setSelectedDateStr(normalizeDate(noticeInMonth.date));
    } else {
      setSelectedDateStr(`${prefix}01`);
    }
  };

  // Jump to today or active semester
  const handleJumpToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9); // October 2026 (Month 9 is October)
    setSelectedDateStr(TODAY_DATE);
    setAgendaScope('selected');
  };

  const handleJumpToSemester = () => {
    setCurrentYear(2026);
    setCurrentMonth(10); // November 2026
    setSelectedDateStr('2026-11-05');
    setAgendaScope('selected');
  };

  // Handle selection from Weekly Digest Modal
  const handleSelectDateFromDigest = (targetDate) => {
    const clean = normalizeDate(targetDate);
    if (!clean) return;
    const parts = clean.split('-').map(Number);
    setCurrentYear(parts[0]);
    setCurrentMonth(parts[1] - 1);
    setSelectedDateStr(clean);
    setAgendaScope('selected');
  };

  // Compute notices in current month
  const currentMonthStr = String(currentMonth + 1).padStart(2, '0');
  const monthPrefix = `${currentYear}-${currentMonthStr}-`;
  
  const noticesInCurrentMonth = useMemo(() => {
    return notices.filter(n => {
      const clean = normalizeDate(n.date);
      return clean && clean.startsWith(monthPrefix);
    }).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }, [notices, monthPrefix]);

  // Compute notices in agenda based on agendaScope and priorityFilter
  const agendaNotices = useMemo(() => {
    let base = [];

    if (agendaScope === 'selected') {
      base = noticesByDate[selectedDateStr] || [];
    } else if (agendaScope === 'month') {
      base = noticesInCurrentMonth;
    } else if (agendaScope === 'upcoming') {
      base = notices.filter(n => {
        const clean = normalizeDate(n.date);
        return clean && clean >= TODAY_DATE;
      }).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    }

    // Apply priority/status filter
    if (priorityFilter === 'urgent') {
      return base.filter(n => n.priority?.toLowerCase() === 'urgent');
    } else if (priorityFilter === 'today') {
      return base.filter(n => normalizeDate(n.date) === TODAY_DATE);
    } else if (priorityFilter === 'upcoming') {
      return base.filter(n => {
        const clean = normalizeDate(n.date);
        return clean && clean > TODAY_DATE;
      });
    } else if (priorityFilter === 'expired') {
      return base.filter(n => {
        const clean = normalizeDate(n.date);
        return clean && clean < TODAY_DATE;
      });
    }

    return base;
  }, [agendaScope, priorityFilter, selectedDateStr, noticesByDate, noticesInCurrentMonth, notices]);

  // Calculate 7-day upcoming count for quick snapshot banner
  const next7DaysCount = useMemo(() => {
    return notices.filter(n => {
      const clean = normalizeDate(n.date);
      return clean && clean >= TODAY_DATE && clean <= '2026-11-07';
    }).length;
  }, [notices]);

  return (
    <div className="space-y-6 pb-12">
      {/* View Header with "What do I need to know this week?" button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-navy-900/90 via-navy-900/80 to-purple-950/40 border border-purple-500/20 backdrop-blur-xl shadow-glow-purple">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-glow-purple">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
                Academic & Event Calendar
              </h2>
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Interactive Timeline
              </span>
            </div>
            <p className="text-xs text-purple-300/80 mt-0.5">
              Accurately synced with college circulars &bull; Reference Date: Oct 31, 2026
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleJumpToToday}
            className="text-xs px-3 py-2 rounded-xl bg-navy-800/90 text-purple-300 hover:text-white border border-white/5 hover:border-purple-500/30 transition-all font-medium"
            title="Jump to today (Oct 31, 2026)"
          >
            Today (Oct 31)
          </button>

          <button
            onClick={handleJumpToSemester}
            className="text-xs px-3 py-2 rounded-xl bg-navy-800/90 text-slate-300 hover:text-white border border-white/5 hover:border-purple-500/30 transition-all font-medium"
            title="Jump to November 2026 semester events"
          >
            Semester (Nov '26)
          </button>

          {/* Primary "What do I need to know this week?" button */}
          <button
            onClick={() => setIsWeeklyDigestOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pulse-cyan hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-glow-purple transition-all duration-200 active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-pulse-glow animate-pulse" />
            <span>What do I need to know this week?</span>
          </button>
        </div>
      </div>

      {/* Snapshot quick banner */}
      <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-purple-200">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Weekly Pulse:</strong> <span className="text-white font-bold">{next7DaysCount} notices scheduled</span> in the upcoming 7 days (including recruitment drives & exam hall ticket deadlines).
          </span>
        </div>
        <button
          onClick={() => setIsWeeklyDigestOpen(true)}
          className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1 shrink-0 transition-colors"
        >
          <span>Open Weekly Digest</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Grid: Calendar on Left (7 cols), Selected Date Agenda on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Box (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-navy-900/80 border border-purple-500/20 p-5 backdrop-blur-xl shadow-card">
          
          {/* Month Navigator Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                ({noticesInCurrentMonth.length} notice{noticesInCurrentMonth.length === 1 ? '' : 's'})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl text-slate-300 hover:text-white bg-navy-800/80 hover:bg-purple-900/30 border border-white/5 hover:border-purple-500/30 transition-all"
                aria-label="Previous month"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl text-slate-300 hover:text-white bg-navy-800/80 hover:bg-purple-900/30 border border-white/5 hover:border-purple-500/30 transition-all"
                aria-label="Next month"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-[11px] font-bold text-slate-400 py-1 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty offset padding cells */}
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} className="h-14 sm:h-16 rounded-xl bg-transparent" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: totalDays }).map((_, index) => {
              const dayNum = index + 1;
              const mStr = String(currentMonth + 1).padStart(2, '0');
              const dStr = String(dayNum).padStart(2, '0');
              const fullDateStr = `${currentYear}-${mStr}-${dStr}`;

              const dayEvents = noticesByDate[fullDateStr] || [];
              const hasEvents = dayEvents.length > 0;
              const hasUrgent = dayEvents.some(e => e.priority?.toLowerCase() === 'urgent');
              const isSelected = selectedDateStr === fullDateStr;
              const isToday = fullDateStr === TODAY_DATE;
              const isPast = fullDateStr < TODAY_DATE;

              return (
                <button
                  key={fullDateStr}
                  onClick={() => {
                    setSelectedDateStr(fullDateStr);
                    setAgendaScope('selected');
                  }}
                  className={`
                    relative h-14 sm:h-16 p-1.5 sm:p-2 rounded-xl flex flex-col justify-between items-start text-left
                    transition-all duration-150 border
                    ${isSelected 
                      ? 'bg-purple-600/30 border-purple-400 ring-2 ring-purple-500/40 shadow-glow-purple text-white z-10 scale-[1.02]' 
                      : isToday
                        ? 'bg-purple-950/40 border-pulse-cyan/50 text-cyan-200'
                        : hasEvents 
                          ? 'bg-navy-800/80 hover:bg-purple-950/40 border-purple-500/30 text-slate-200' 
                          : 'bg-navy-950/40 hover:bg-navy-800/40 border-white/5 text-slate-400'}
                    ${isPast && !hasEvents ? 'opacity-40' : ''}
                  `}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-semibold ${
                      isToday 
                        ? 'px-1.5 py-0.5 rounded-md bg-pulse-cyan/20 text-cyan-300 font-bold border border-pulse-cyan/40' 
                        : isSelected ? 'font-bold text-white' : ''
                    }`}>
                      {dayNum}
                    </span>

                    {/* Automatic Priority Indicator dots */}
                    <div className="flex items-center gap-1">
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title="Today" />
                      )}
                      {hasUrgent && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Urgent Notice" />
                      )}
                    </div>
                  </div>

                  {/* Notice indicator badge */}
                  {hasEvents && (
                    <div className="w-full truncate">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded block truncate border ${
                        hasUrgent
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      }`}>
                        {dayEvents.length} {dayEvents.length === 1 ? 'Notice' : 'Notices'}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Urgent</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Today</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Upcoming</span>
              </span>
            </div>
            <span className="text-purple-300/70">Click any date to inspect notices</span>
          </div>

        </div>

        {/* Date-Wise Agenda Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-navy-900/80 border border-purple-500/20 p-5 backdrop-blur-xl shadow-card flex flex-col justify-between">
          <div>
            {/* Agenda Scope Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-navy-950 rounded-xl border border-white/5 mb-3.5">
              <button
                onClick={() => setAgendaScope('selected')}
                className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all ${
                  agendaScope === 'selected'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Selected Day
              </button>
              <button
                onClick={() => setAgendaScope('month')}
                className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all ${
                  agendaScope === 'month'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All in {monthNames[currentMonth].slice(0, 3)}
              </button>
              <button
                onClick={() => setAgendaScope('upcoming')}
                className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all ${
                  agendaScope === 'upcoming'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Upcoming
              </button>
            </div>

            {/* Agenda Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  {agendaScope === 'selected' 
                    ? 'Agenda for Selected Date' 
                    : agendaScope === 'month' 
                      ? `${monthNames[currentMonth]} ${currentYear} Events` 
                      : 'All Upcoming Events'}
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  {agendaScope === 'selected' ? selectedDateStr : `${agendaNotices.length} Notices Found`}
                </h4>
              </div>

              {/* Priority Filter Select */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs bg-navy-950 border border-purple-500/30 rounded-lg px-2 py-1 text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent Only</option>
                <option value="today">Today's Date</option>
                <option value="upcoming">Upcoming</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Agenda Notices List */}
            {agendaNotices.length > 0 ? (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {agendaNotices.map((notice) => {
                  const status = getNoticeStatus(notice);
                  return (
                    <div
                      key={notice.id}
                      className="p-3.5 rounded-xl bg-navy-950/80 border border-purple-500/15 hover:border-purple-400/40 transition-all group"
                    >
                      {/* Category & Status badges */}
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {notice.category}
                          </span>

                          {/* Automatic Status Badges */}
                          {status.isToday && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                              TODAY
                            </span>
                          )}

                          {status.isUrgent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                              URGENT
                            </span>
                          )}

                          {!status.isToday && !status.isUrgent && status.isUpcoming && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              UPCOMING
                            </span>
                          )}

                          {status.isPast && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              EXPIRED
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-medium text-slate-400">
                          {notice.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h5 
                        onClick={() => onViewDetails(notice)}
                        className="text-sm font-bold text-white group-hover:text-purple-300 cursor-pointer transition-colors leading-snug"
                      >
                        {notice.title}
                      </h5>

                      {/* Time & Venue */}
                      <div className="mt-2 text-xs text-slate-400 space-y-1">
                        {notice.time && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{notice.time}</span>
                          </div>
                        )}
                        {notice.venue && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                            <span className="truncate">{notice.venue}</span>
                          </div>
                        )}
                      </div>

                      {/* Action required pill if present */}
                      {notice.actionRequired && (
                        <div className="mt-2.5 p-2 rounded-lg bg-purple-950/40 border border-purple-500/20 text-[11px] text-amber-200 flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{notice.actionRequired}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                        <button
                          onClick={() => onViewDetails(notice)}
                          className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                        >
                          <span>Full notice details</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-14 px-4 rounded-xl bg-navy-950/40 border border-white/5">
                <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h5 className="text-sm font-semibold text-slate-300">No notices for this filter</h5>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  {agendaScope === 'selected'
                    ? `No circulars scheduled for ${selectedDateStr}. Click other dates or switch to 'All in ${monthNames[currentMonth].slice(0, 3)}'.`
                    : 'No notices match the selected criteria.'}
                </p>
                {agendaScope === 'selected' && (
                  <button
                    onClick={() => setAgendaScope('month')}
                    className="mt-3 text-xs px-3 py-1.5 rounded-lg bg-navy-800 text-purple-300 hover:text-white border border-white/10"
                  >
                    View All {monthNames[currentMonth]} Events
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer insight */}
          <div className="pt-4 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-purple-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Priorities automatically calculated relative to active dates.</span>
            </span>
          </div>

        </div>

      </div>

      {/* Weekly Digest Modal */}
      <WeeklyDigestModal
        isOpen={isWeeklyDigestOpen}
        onClose={() => setIsWeeklyDigestOpen(false)}
        notices={notices}
        referenceDate={TODAY_DATE}
        onSelectDate={handleSelectDateFromDigest}
        onViewDetails={onViewDetails}
      />
    </div>
  );
}
