import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import api from '../../lib/api';
import { ClipboardList, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react';

const MOCK = [
  {
    id: 1, title: 'Mid-Term Lab Report', dueDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'active', totalMarks: 100,
    course: { name: 'Physics 101', code: 'PHY101' }, class: { name: 'Section A' },
    submissions: [{ id: 1, status: 'submitted' }, { id: 2, status: 'submitted' }]
  },
  {
    id: 2, title: 'Quantum Mechanics Essay', dueDate: new Date(Date.now() - 172800000).toISOString(),
    status: 'active', totalMarks: 50,
    course: { name: 'Physics 302', code: 'PHY302' }, class: { name: 'Section A' },
    submissions: [{ id: 3, status: 'submitted' }]
  },
  {
    id: 3, title: 'Weekly Problem Set 4', dueDate: new Date().toISOString(),
    status: 'draft', totalMarks: 30,
    course: { name: 'Physics 101', code: 'PHY101' }, class: { name: 'Section A' },
    submissions: []
  },
];

function formatDate(d) {
  const date = new Date(d);
  const diff = Date.now() - date.getTime();
  if (diff < 0) return `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Due Today';
  if (days === 1) return 'Due Yesterday';
  return `${days}d ago`;
}

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/assignments')
      .then(r => setAssignments(r.data.length ? r.data : MOCK))
      .catch(() => setAssignments(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? assignments : assignments.filter(a => a.status === filter);

  return (
    <div>
      <Topbar
        title="Assignments"
        subtitle="Create and manage assignments for your classes"
        showSearch={false}
        actions={<Button variant="default" className="bg-primary text-white">+ New Assignment</Button>}
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'active', 'draft'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all cursor-pointer ${filter === f ? 'bg-accent text-white' : 'text-text-secondary bg-white border border-border hover:border-accent'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-text-muted">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <ClipboardList size={16} />
                        </div>
                        <p className="font-medium text-text">{a.title}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-text-secondary">{a.course?.name}</p>
                        <p className="text-xs text-text-muted font-mono">{a.course?.code}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                        <Clock size={13} />
                        {formatDate(a.dueDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">{a.totalMarks} pts</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-text-muted" />
                        <span className="text-sm text-text-secondary">{(a.submissions || []).length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {a.status === 'active' ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="warning">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {a.status === 'active' && (a.submissions || []).length > 0 ? (
                        <button className="text-sm text-accent hover:text-accent-light font-medium cursor-pointer">
                          Grade Now
                        </button>
                      ) : (
                        <button className="text-sm text-text-muted cursor-pointer hover:text-text">
                          Edit
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
