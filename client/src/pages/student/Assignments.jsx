import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import api from '../../lib/api';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, Upload } from 'lucide-react';

const MOCK = [
  { id: 1, title: 'Mid-Term Lab Report', dueDate: new Date(Date.now() - 86400000).toISOString(), status: 'active', totalMarks: 100, course: { name: 'Physics 101', code: 'PHY101' }, submissions: [{ status: 'submitted' }] },
  { id: 2, title: 'Quantum Mechanics Essay', dueDate: new Date(Date.now() - 172800000).toISOString(), status: 'active', totalMarks: 50, course: { name: 'Physics 302', code: 'PHY302' }, submissions: [] },
  { id: 3, title: 'Weekly Problem Set 4', dueDate: new Date(Date.now() + 86400000).toISOString(), status: 'active', totalMarks: 30, course: { name: 'Physics 101', code: 'PHY101' }, submissions: [] },
];

function isPast(d) { return new Date(d) < new Date(); }

function formatDue(d) {
  const diff = new Date(d) - Date.now();
  if (diff < 0) return { label: `Overdue by ${Math.floor(-diff / 86400000)}d`, color: 'text-danger' };
  const days = Math.floor(diff / 86400000);
  if (days === 0) return { label: 'Due Today', color: 'text-warning' };
  return { label: `Due in ${days}d`, color: 'text-success' };
}

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    api.get('/assignments')
      .then(r => setAssignments(r.data.length ? r.data : MOCK))
      .catch(() => setAssignments(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const filtered = assignments.filter(a => {
    const submitted = (a.submissions || []).length > 0;
    if (tab === 'pending') return !submitted;
    if (tab === 'submitted') return submitted;
    return true;
  });

  return (
    <div>
      <Topbar title="Assignments" subtitle="Track and submit your assignments" showSearch={false} />

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'submitted'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all cursor-pointer ${tab === t ? 'bg-accent text-white' : 'text-text-secondary bg-white border border-border hover:border-accent'}`}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-text-muted">Loading…</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(a => {
            const submitted = (a.submissions || []).length > 0;
            const due = formatDue(a.dueDate);
            return (
              <Card key={a.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${submitted ? 'bg-green-50 text-green-600' : isPast(a.dueDate) ? 'bg-red-50 text-danger' : 'bg-blue-50 text-accent'}`}>
                        {submitted ? <CheckCircle2 size={20} /> : <ClipboardList size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-text">{a.title}</h3>
                          {submitted ? <Badge variant="success">Submitted</Badge> : isPast(a.dueDate) ? <Badge variant="danger">Overdue</Badge> : <Badge variant="info">Pending</Badge>}
                        </div>
                        <p className="text-sm text-text-secondary">{a.course?.name} <span className="text-text-muted font-mono text-xs">({a.course?.code})</span></p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className={`flex items-center gap-1 text-xs font-medium ${due.color}`}>
                            <Clock size={12} />{due.label}
                          </span>
                          <span className="text-xs text-text-muted">{a.totalMarks} marks</span>
                        </div>
                      </div>
                    </div>
                    {!submitted && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-light transition-colors cursor-pointer shrink-0">
                        <Upload size={14} /> Submit
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-text-muted gap-2">
              <CheckCircle2 size={32} />
              <p>All caught up!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
