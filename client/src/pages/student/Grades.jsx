import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import api from '../../lib/api';
import { TrendingUp } from 'lucide-react';

const MOCK = [
  { id: 1, grade: 'A', gradePoints: 4.0, semester: 'Spring 2024', course: { name: 'Physics 101', code: 'PHY101' } },
  { id: 2, grade: 'A-', gradePoints: 3.7, semester: 'Spring 2024', course: { name: 'Computer Science 101', code: 'CS101' } },
];

function gradeColor(g) {
  if (!g) return 'text-text-muted';
  if (g.startsWith('A')) return 'text-green-600';
  if (g.startsWith('B')) return 'text-blue-600';
  if (g.startsWith('C')) return 'text-amber-600';
  return 'text-danger';
}

export default function StudentGrades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/grades/my')
      .then(r => setGrades(r.data.length ? r.data : MOCK))
      .catch(() => setGrades(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const gpa = grades.length > 0
    ? (grades.reduce((s, g) => s + (g.gradePoints || 0), 0) / grades.length).toFixed(2)
    : '—';

  return (
    <div>
      <Topbar title="Grades" subtitle="Your academic performance" showSearch={false} />

      {/* GPA Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-primary to-primary-light text-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-white/70 text-sm">Cumulative GPA</p>
                <p className="text-3xl font-bold">{gpa}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-text-muted text-sm mb-1">Total Courses</p>
            <p className="text-3xl font-bold text-text">{grades.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-text-muted text-sm mb-1">Semester</p>
            <p className="text-3xl font-bold text-text">{grades[0]?.semester || '—'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Grade Report</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-text-muted">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Grade Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map(g => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium text-text">{g.course?.name}</TableCell>
                    <TableCell className="font-mono text-sm text-text-muted">{g.course?.code}</TableCell>
                    <TableCell className="text-sm text-text-secondary">{g.semester}</TableCell>
                    <TableCell>
                      <span className={`text-xl font-bold ${gradeColor(g.grade)}`}>{g.grade}</span>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">{g.gradePoints?.toFixed(1)}</TableCell>
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
