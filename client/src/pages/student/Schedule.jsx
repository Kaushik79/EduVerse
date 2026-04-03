import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import api from '../../lib/api';
import { Clock } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const DAY_LABELS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri' };
const TYPE_COLORS = {
  lecture: 'bg-blue-100 border-blue-300 text-blue-800',
  lab: 'bg-green-100 border-green-300 text-green-800',
  tutorial: 'bg-amber-100 border-amber-300 text-amber-800',
};

const MOCK = [
  { id: 1, title: 'Physics 101', day: 'monday', startTime: '09:00', endTime: '10:30', room: 'Room 101', type: 'lecture' },
  { id: 2, title: 'CS 101', day: 'tuesday', startTime: '10:00', endTime: '11:30', room: 'Lab A', type: 'lab' },
  { id: 3, title: 'Physics 302', day: 'wednesday', startTime: '11:00', endTime: '12:30', room: 'Room 302', type: 'lecture' },
  { id: 4, title: 'Tutorial', day: 'thursday', startTime: '14:00', endTime: '15:00', room: 'Room 201', type: 'tutorial' },
];

export default function StudentSchedule() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    api.get('/schedule')
      .then(r => setSchedule(r.data.length ? r.data : MOCK))
      .catch(() => setSchedule(MOCK));
  }, []);

  const byDay = DAYS.reduce((acc, day) => {
    acc[day] = schedule.filter(s => s.day === day);
    return acc;
  }, {});

  return (
    <div>
      <Topbar title="Schedule" subtitle="Your weekly class timetable" showSearch={false} />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DAYS.map(day => (
          <div key={day}>
            <div className="text-center mb-3 py-1 rounded-lg bg-gray-100">
              <span className="text-xs font-bold text-text uppercase tracking-wider">{DAY_LABELS[day]}</span>
            </div>
            <div className="space-y-3 min-h-[180px]">
              {byDay[day].length === 0 ? (
                <div className="h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-text-muted text-xs">Free</div>
              ) : (
                byDay[day].map(s => (
                  <div key={s.id} className={`rounded-xl border p-3 ${TYPE_COLORS[s.type] || 'bg-gray-100 border-gray-200 text-gray-800'}`}>
                    <p className="font-semibold text-sm mb-1">{s.title}</p>
                    <div className="flex items-center gap-1 text-xs opacity-80 mb-1">
                      <Clock size={11} />{s.startTime}–{s.endTime}
                    </div>
                    <p className="text-xs opacity-70">{s.room}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
