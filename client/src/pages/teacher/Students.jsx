import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import api from '../../lib/api';
import { Users, Search, Phone, Mail, BookOpen } from 'lucide-react';

const MOCK = [
  { id: 1, name: 'Alex Morgan', email: 'alex@eduverse.com', studentId: '4829', department: 'CS Undergrad', semester: 5, section: 'A', batch: '2022-2026', phone: '+916360299107', isVerified: true },
  { id: 2, name: 'Michael Chen', email: 'michael@eduverse.com', studentId: '4830', department: 'CS Undergrad', semester: 5, section: 'A', batch: '2022-2026', phone: '+918217856602', isVerified: true },
  { id: 3, name: 'Sarah Miller', email: 'sarah@eduverse.com', studentId: '4831', department: 'Physics', semester: 3, section: 'B', batch: '2023-2027', phone: '+919940404547', isVerified: true },
  { id: 4, name: 'David Kim', email: 'david@eduverse.com', studentId: '4832', department: 'Physics', semester: 5, section: 'A', batch: '2022-2026', phone: '+918778476020', isVerified: true },
  { id: 5, name: 'Emma Watson', email: 'emma@eduverse.com', studentId: '4833', department: 'CS Undergrad', semester: 3, section: 'B', batch: '2023-2027', phone: '+917200585726', isVerified: true },
];

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');

  useEffect(() => {
    api.get('/users?role=student')
      .then(r => setStudents(r.data.length ? r.data : MOCK))
      .catch(() => setStudents(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const sections = ['all', ...new Set(students.map(s => s.section).filter(Boolean))];

  const filtered = students.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId?.includes(search);
    const matchSection = sectionFilter === 'all' || s.section === sectionFilter;
    return matchSearch && matchSection;
  });

  return (
    <div>
      <Topbar title="Students" subtitle={`${students.length} students enrolled`} showSearch={false} />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or student ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
          />
        </div>
        <div className="flex gap-2">
          {sections.map(s => (
            <button
              key={s}
              onClick={() => setSectionFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all cursor-pointer ${sectionFilter === s ? 'bg-accent text-white' : 'bg-white border border-border text-text-secondary hover:border-accent'
                }`}
            >
              {s === 'all' ? 'All' : `Sec ${s}`}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-text-muted">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-text-muted gap-2">
              <Users size={32} />
              <p>No students found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar alt={s.name} fallback={s.name.charAt(0)} size="sm" />
                        <div>
                          <p className="font-medium text-text text-sm">{s.name}</p>
                          <p className="text-xs text-text-muted">{s.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-text-secondary">{s.studentId}</TableCell>
                    <TableCell className="text-sm text-text-secondary">{s.department}</TableCell>
                    <TableCell className="text-sm text-text-secondary">Sem {s.semester}</TableCell>
                    <TableCell>
                      <Badge variant={s.section === 'A' ? 'info' : 'warning'}>{s.section}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-text-muted">{s.batch}</TableCell>
                    <TableCell>
                      {s.isVerified ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
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
