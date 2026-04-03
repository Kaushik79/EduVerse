import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import api from '../../lib/api';
import { FileQuestion, Clock, MapPin, Calendar } from 'lucide-react';

const MOCK = [
  { id: 1, title: 'Physics 101 Midterm', date: new Date(Date.now() + 604800000).toISOString(), duration: 120, type: 'midterm', totalMarks: 100, venue: 'Hall A', course: { name: 'Physics 101' } },
  { id: 2, title: 'Physics 302 Quiz 3', date: new Date(Date.now() + 259200000).toISOString(), duration: 30, type: 'quiz', totalMarks: 25, venue: 'Room 201', course: { name: 'Physics 302' } },
  { id: 3, title: 'CS 101 Final', date: new Date(Date.now() + 2592000000).toISOString(), duration: 180, type: 'final', totalMarks: 100, venue: 'Main Hall', course: { name: 'CS 101' } },
];

const TYPE_BADGE = { midterm: 'warning', quiz: 'info', final: 'danger', assignment: 'success' };

function formatExamDate(d) {
  const date = new Date(d);
  const days = Math.ceil((date - Date.now()) / 86400000);
  return {
    date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    days,
  };
}

export default function StudentExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/exams')
      .then(r => setExams(r.data.length ? r.data : MOCK))
      .catch(() => setExams(MOCK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Topbar title="Exams" subtitle="Upcoming examinations and schedule" showSearch={false} />

      {loading ? (
        <div className="flex items-center justify-center h-48 text-text-muted">Loading…</div>
      ) : (
        <div className="space-y-4">
          {exams.map(exam => {
            const { date, time, days } = formatExamDate(exam.date);
            return (
              <Card key={exam.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-red-50 flex flex-col items-center justify-center shrink-0 border border-red-100">
                        <FileQuestion size={20} className="text-danger mb-0.5" />
                        <span className="text-[10px] font-bold text-danger uppercase">{exam.type}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-text">{exam.title}</h3>
                          <Badge variant={TYPE_BADGE[exam.type] || 'info'}>{exam.type}</Badge>
                        </div>
                        <p className="text-sm text-text-secondary mb-2">{exam.course?.name}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                          <span className="flex items-center gap-1"><Calendar size={12} />{date}</span>
                          <span className="flex items-center gap-1"><Clock size={12} />{exam.duration} mins</span>
                          <span className="flex items-center gap-1"><MapPin size={12} />{exam.venue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center shrink-0">
                      <p className={`text-2xl font-bold ${days <= 3 ? 'text-danger' : days <= 7 ? 'text-warning' : 'text-text'}`}>{days}</p>
                      <p className="text-xs text-text-muted">days left</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
