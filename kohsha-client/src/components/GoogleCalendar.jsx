import { useState, useMemo, useEffect } from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EVENT_COLORS = {
  HOLIDAY:  { pill: 'bg-red-100 text-red-700 border-red-300',   dot: 'bg-red-500',    badge: 'bg-red-500 text-white' },
  EXAM:     { pill: 'bg-violet-100 text-violet-700 border-violet-300', dot: 'bg-violet-500', badge: 'bg-violet-500 text-white' },
  ACTIVITY: { pill: 'bg-emerald-100 text-emerald-700 border-emerald-300', dot: 'bg-emerald-500', badge: 'bg-emerald-500 text-white' },
  EVENT:    { pill: 'bg-blue-100 text-blue-700 border-blue-300', dot: 'bg-blue-500',   badge: 'bg-blue-500 text-white' },
  OTHER:    { pill: 'bg-gray-100 text-gray-600 border-gray-300', dot: 'bg-gray-400',   badge: 'bg-gray-400 text-white' },
};

const TYPE_ICONS = { HOLIDAY: '🎉', EXAM: '📝', ACTIVITY: '🎨', EVENT: '📅', OTHER: '📌' };

export default function GoogleCalendar({ events = [], onEventClick = () => {}, isReadOnly = false, onCreateClick = () => {}, onMonthChange = () => {} }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  // Debug: log events when received
  useMemo(() => {
    if (events.length > 0) {
      console.log(`📅 GoogleCalendar received ${events.length} events`);
      console.log('First 3 events:', events.slice(0, 3).map(e => ({ title: e.title, start: e.startDate })));
    }
    return events;
  }, [events]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = daysInPrevMonth - firstDay + 1; i <= daysInPrevMonth; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, isCurrentMonth: false });
    }
    return days;
  }, [month, year]);

  const getEventsForDay = (day, isCurrentMonth) => {
    if (!isCurrentMonth || !day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => {
      const start = e.startDate?.slice(0, 10);
      const end = e.endDate?.slice(0, 10) || start;
      return dateStr >= start && dateStr <= end;
    });
  };

  const isToday = (day, isCurrentMonth) =>
    isCurrentMonth && day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

  const isSunday = (idx) => idx % 7 === 0;

  const navigate = (dir) => {
    let m = month + dir;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
    onMonthChange(m + 1, y);
  };

  const goToday = () => {
    setMonth(now.getMonth());
    setYear(now.getFullYear());
    onMonthChange(now.getMonth() + 1, now.getFullYear());
  };

  const [popup, setPopup] = useState(null); // { day, events }
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!popup) return;
    const close = (e) => { if (!e.target.closest('[data-popup]')) setPopup(null); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [popup]);

  const upcomingEvents = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return events
      .filter(e => new Date(e.startDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 6);
  }, [events]);

  const daysUntil = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff < 0) return 'Past';
    return `In ${diff}d`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 bg-gray-50 overflow-hidden">
      {/* ── Left: Calendar ─────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white shadow-sm min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between px-3 lg:px-6 py-2.5 lg:py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 lg:gap-3">
            <button onClick={() => navigate(-1)} className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => navigate(1)} className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <h2 className="text-base lg:text-xl font-bold text-gray-900 tracking-tight">{MONTHS[month]} <span className="text-gray-400 font-normal">{year}</span></h2>
          </div>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <button onClick={goToday} className="px-2.5 lg:px-3 py-1 lg:py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
              Today
            </button>
            {!isReadOnly && (
              <button onClick={onCreateClick} className="px-3 lg:px-4 py-1 lg:py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                + Add
              </button>
            )}
            {/* Mobile events panel toggle */}
            <button
              onClick={() => setShowSidebar(s => !s)}
              className={`lg:hidden px-2.5 py-1 text-xs font-semibold border rounded-full transition-colors ${
                showSidebar ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              📋
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS_SHORT.map((d, i) => (
            <div key={d} className={`py-2 text-center text-xs font-semibold tracking-widest uppercase ${i === 0 ? 'text-red-400' : 'text-gray-400'}`}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-6 overflow-hidden">
          {calendarDays.map((dayObj, idx) => {
            const dayEvents = getEventsForDay(dayObj.day, dayObj.isCurrentMonth);
            const todayFlag = isToday(dayObj.day, dayObj.isCurrentMonth);
            const sunFlag = isSunday(idx);

            return (
              <div
                key={idx}
                className={`border-r border-b border-gray-100 flex flex-col overflow-hidden transition-colors
                  ${!dayObj.isCurrentMonth ? 'bg-gray-50/60' : 'bg-white hover:bg-blue-50/30'}
                  ${sunFlag && dayObj.isCurrentMonth ? 'bg-red-50/20' : ''}
                  ${todayFlag ? '!bg-blue-50/60' : ''}
                `}
              >
                {/* Date number */}
                <div className="px-1 lg:px-2 pt-1 lg:pt-1.5 pb-0.5 flex items-center justify-between">
                  <span className={`text-[10px] lg:text-xs font-bold w-5 lg:w-6 h-5 lg:h-6 flex items-center justify-center rounded-full
                    ${todayFlag ? 'bg-blue-600 text-white' : sunFlag && dayObj.isCurrentMonth ? 'text-red-400' : dayObj.isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}
                  `}>
                    {dayObj.day}
                  </span>
                </div>

                {/* Events */}
                <div className="px-0.5 lg:px-1 pb-0.5 lg:pb-1 space-y-[1px] lg:space-y-[2px] flex-1 overflow-hidden">
                  {dayEvents.slice(0, 3).map((ev) => {
                    const c = EVENT_COLORS[ev.type] || EVENT_COLORS.OTHER;
                    return (
                      <div
                        key={ev._id}
                        onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}
                        className={`text-[10px] leading-tight px-1 lg:px-1.5 py-[2px] lg:py-[3px] rounded border-l-2 cursor-pointer truncate font-medium ${c.pill} hover:brightness-95 transition-all`}
                        title={ev.title}
                      >
                        <span className="hidden lg:inline">{ev.title}</span>
                        <span className={`inline lg:hidden w-1.5 h-1.5 rounded-full inline-block ${c.dot}`} />
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div
                      onClick={(e) => { e.stopPropagation(); setPopup({ day: dayObj.day, events: dayEvents }); }}
                      className="text-[9px] lg:text-[10px] text-blue-500 font-semibold px-1 lg:px-1.5 cursor-pointer hover:text-blue-700 select-none"
                    >
                      +{dayEvents.length - 3}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Sidebar ──────────────────────────────── */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} lg:flex flex-col bg-white border-t lg:border-t-0 lg:border-l border-gray-100 overflow-hidden w-full lg:w-72 max-h-64 lg:max-h-none`}>
        {/* Sidebar Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Upcoming</p>
          <p className="text-lg font-bold text-gray-900">Events & Holidays</p>
        </div>

        {/* Event list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
              <span className="text-4xl mb-3">📭</span>
              <p className="text-sm">No upcoming events</p>
            </div>
          ) : (
            upcomingEvents.map((ev) => {
              const c = EVENT_COLORS[ev.type] || EVENT_COLORS.OTHER;
              return (
                <div
                  key={ev._id}
                  onClick={() => onEventClick(ev)}
                  className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all bg-white group"
                >
                  <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${c.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition-colors">{ev.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(ev.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${c.badge}`}>
                    {daysUntil(ev.startDate)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/60">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Legend</p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-3">
            {Object.entries(EVENT_COLORS).map(([type, c]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                <span className="text-xs text-gray-500">{TYPE_ICONS[type]} {type.charAt(0) + type.slice(1).toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* +N more popup */}
      {popup && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center" onClick={() => setPopup(null)}>
          <div data-popup className="bg-white rounded-2xl shadow-2xl p-5 w-72 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-gray-800 text-sm">{MONTHS[month]} {popup.day}</p>
              <button onClick={() => setPopup(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
            </div>
            <div className="space-y-2">
              {popup.events.map(ev => {
                const c = EVENT_COLORS[ev.type] || EVENT_COLORS.OTHER;
                return (
                  <div
                    key={ev._id}
                    onClick={() => { onEventClick(ev); setPopup(null); }}
                    className={`text-xs px-3 py-2 rounded-lg border-l-2 cursor-pointer flex items-center gap-2 font-medium ${c.pill} hover:brightness-95`}
                  >
                    <span>{TYPE_ICONS[ev.type] || '📌'}</span>
                    <span className="truncate">{ev.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
