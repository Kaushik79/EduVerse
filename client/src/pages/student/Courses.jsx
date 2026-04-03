import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import api from '../../lib/api';
import { BookOpen, Users, GraduationCap } from 'lucide-react';

const MOCK = [
  { id: 1, name: 'Physics 101', code: 'PHY101', description: 'Introduction to Physics', semester: 'Fall 2024', credits: 4 },
  { id: 2, name: 'Physics 302', code: 'PHY302', description: 'Quantum Mechanics', semester: 'Fall 2024', credits: 3 },
  { id: 3, name: 'Computer Science 101', code: 'CS101', description: 'Intro to Computer Science', semester: 'Fall 2024', credits: 4 },
];

const COLORS = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then(r => setCourses(r.data.length ? r.data : MOCK))
      .catch(() => setCourses(MOCK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Topbar title="Courses" subtitle={`${courses.length} courses this semester`} showSearch={false} />

      {loading ? (
        <div className="flex items-center justify-center h-48 text-text-muted">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c, i) => (
            <Card key={c.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`h-2 ${COLORS[i % COLORS.length]}`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <BookOpen size={20} className="text-text-muted" />
                  </div>
                  <span className="font-mono text-xs bg-gray-100 text-text-secondary px-2 py-1 rounded-md">{c.code}</span>
                </div>
                <h3 className="font-semibold text-text mb-1">{c.name}</h3>
                <p className="text-sm text-text-muted mb-4 line-clamp-2">{c.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <GraduationCap size={13} />
                    <span>{c.credits} Credits</span>
                  </div>
                  <Badge variant="info">{c.semester}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
