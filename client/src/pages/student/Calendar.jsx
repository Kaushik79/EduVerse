import { useState, useEffect, useMemo } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import api from '../../lib/api';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';

const typeColors = {
  assignment: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  exam: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  club: { bg: 'bg-cyan-100', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  academic: { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  holiday: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  event: { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
  deadline: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
};

export default function StudentCalendar() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    api.get('/calendar').then(r => setEvents(r.data)).catch(() => {
      // Fallback demo events
      setEvents([
        { id: 1, title: 'Physics 101 Midterm', type: 'exam', startDate: new Date(Date.now() + 604800000).toISOString(), color: '#ef4444' },
        { id: 2, title: 'Lab Report Deadline', type: 'deadline', startDate: new Date(Date.now() + 259200000).toISOString(), color: '#f59e0b' },
        { id: 3, title: 'Hackathon Registration Opens', type: 'event', startDate: new Date(Date.now() + 432000000).toISOString(), color: '#8b5cf6' },
        { id: 4, title: 'Tech Club Workshop: Docker', type: 'club', startDate: new Date(Date.now() + 172800000).toISOString(), color: '#06b6d4' },
        { id: 5, title: 'Mid-Semester Break', type: 'holiday', startDate: new Date(Date.now() + 1209600000).toISOString(), endDate: new Date(Date.now() + 1814400000).toISOString(), color: '#22c55e' },
        { id: 6, title: 'CS101 Assignment Due', type: 'assignment', startDate: new Date(Date.now() + 345600000).toISOString(), color: '#3b82f6' },
      ]);
    });
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach(ev => {
      const d = new Date(ev.startDate).toDateString();
      if (!map[d]) map[d] = [];
      map[d].push(ev);
    });
    return map;
  }, [events]);

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate.toDateString()] || []) : [];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = new Date();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div>
      <Topbar title="Calendar" subtitle="All your activities in one view" showSearch={false} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"><ChevronLeft size={20} /></button>
            <CardTitle>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</CardTitle>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"><ChevronRight size={20} /></button>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-text-muted py-2">{d}</div>
              ))}
            </div>
            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const date = new Date(year, month, day);
                const dateStr = date.toDateString();
                const isToday = date.toDateString() === today.toDateString();
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                const dayEvents = eventsByDate[dateStr] || [];

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`relative p-2 min-h-[72px] rounded-lg text-left transition-all cursor-pointer border
                      ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-transparent hover:bg-gray-50'}
                      ${isToday ? 'bg-blue-50/50' : ''}
                    `}
                  >
                    <span className={`text-sm font-medium ${isToday ? 'text-primary font-bold' : 'text-text'}`}>{day}</span>
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map((ev, j) => (
                        <div key={j} className={`w-full h-1 rounded-full`} style={{ backgroundColor: ev.color || '#3b82f6' }} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar: Selected Date Events + Legend */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalIcon size={18} className="text-accent" />
                {selectedDate
                  ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate && selectedEvents.length === 0 && (
                <p className="text-sm text-text-muted py-4 text-center">No events on this day.</p>
              )}
              <div className="space-y-3">
                {selectedEvents.map((ev, i) => {
                  const colors = typeColors[ev.type] || typeColors.event;
                  return (
                    <div key={i} className={`p-3 rounded-lg ${colors.bg}`}>
                      <p className={`text-sm font-semibold ${colors.text}`}>{ev.title}</p>
                      <p className="text-xs text-text-muted mt-1 capitalize">{ev.type}</p>
                      {ev.description && <p className="text-xs text-text-secondary mt-1">{ev.description}</p>}
                    </div>
                  );
                })}
              </div>
              {!selectedDate && (
                <p className="text-sm text-text-muted py-4 text-center">Click a date to see events.</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {events.filter(e => new Date(e.startDate) >= today).sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).slice(0, 5).map((ev, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                    <div className="w-1 h-8 rounded-full" style={{ backgroundColor: ev.color || '#3b82f6' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{ev.title}</p>
                      <p className="text-xs text-text-muted">{new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <Badge variant="secondary">{ev.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(typeColors).map(([type, colors]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                    <span className="text-xs text-text-secondary capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
