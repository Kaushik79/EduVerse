import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import api from '../../lib/api';
import { BookOpen, GraduationCap, Users } from 'lucide-react';

const MOCK_COURSES = [
  { id: 1, name: 'Physics 101', code: 'PHY101', semester: 'Fall 2024', credits: 4 },
  { id: 2, name: 'Physics 302', code: 'PHY302', semester: 'Fall 2024', credits: 3 },
  { id: 3, name: 'Computer Science 101', code: 'CS101', semester: 'Fall 2024', credits: 4 },
];
const MOCK_CLASSES = [
  { id: 1, name: 'Physics 101 - Section A', section: 'A', studentCount: 142, course: { name: 'Physics 101' } },
  { id: 2, name: 'Physics 302 - Section A', section: 'A', studentCount: 35, course: { name: 'Physics 302' } },
];

export default function AcademicControl() {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [tab, setTab] = useState('courses');

  useEffect(() => {
    api.get('/courses').then(r => setCourses(r.data.length ? r.data : MOCK_COURSES)).catch(() => setCourses(MOCK_COURSES));
    api.get('/classes').then(r => setClasses(r.data.length ? r.data : MOCK_CLASSES)).catch(() => setClasses(MOCK_CLASSES));
  }, []);

  return (
    <div>
      <Topbar title="Academic Control" subtitle="Manage courses, classes and curriculum" showSearch={false} />

      <div className="flex gap-2 mb-6">
        {['courses', 'classes'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all cursor-pointer ${tab === t ? 'bg-accent text-white' : 'bg-white border border-border text-text-secondary hover:border-accent'}`}>
            {t === 'courses' ? `📚 ${courses.length} Courses` : `🏫 ${classes.length} Classes`}
          </button>
        ))}
      </div>

      {tab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c, i) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                    <BookOpen size={20} />
                  </div>
                  <span className="font-mono text-xs bg-gray-100 text-text-secondary px-2 py-1 rounded-md">{c.code}</span>
                </div>
                <h3 className="font-semibold text-text mb-1">{c.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-text-muted">{c.credits} Credits</span>
                  <Badge variant="info">{c.semester}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'classes' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-text-muted" />
                        <span className="font-medium text-text text-sm">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">{c.course?.name}</TableCell>
                    <TableCell><Badge variant="info">Section {c.section}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-text-muted" />
                        <span className="text-sm text-text-secondary">{c.studentCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button className="text-sm text-accent hover:text-accent-light font-medium cursor-pointer">View</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
