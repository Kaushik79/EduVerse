import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import api from '../../lib/api';
import { GraduationCap, Users, BookOpen, Hash } from 'lucide-react';

const MOCK = [
  { id: 1, name: 'Physics 101 - Section A', section: 'A', studentCount: 142, course: { name: 'Physics 101', code: 'PHY101' } },
  { id: 2, name: 'Physics 302 - Section A', section: 'A', studentCount: 35, course: { name: 'Physics 302', code: 'PHY302' } },
];

export default function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/classes')
      .then(r => setClasses(r.data.length ? r.data : MOCK))
      .catch(() => setClasses(MOCK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Topbar
        title="Classes"
        subtitle="Manage your classes and sections"
        showSearch={false}
        actions={<Button variant="default" className="bg-primary text-white">+ New Class</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center h-48 text-text-muted">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map(cls => (
            <Card key={cls.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <GraduationCap size={24} />
                  </div>
                  <Badge variant="info">Section {cls.section}</Badge>
                </div>
                <h3 className="font-semibold text-text text-base mb-1">{cls.course?.name || cls.name}</h3>
                <p className="text-xs text-text-muted mb-4 font-mono">{cls.course?.code}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Users size={14} className="text-text-muted" />
                      <span className="text-xs text-text-muted">Students</span>
                    </div>
                    <p className="text-lg font-bold text-text">{cls.studentCount}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Hash size={14} className="text-text-muted" />
                      <span className="text-xs text-text-muted">Section</span>
                    </div>
                    <p className="text-lg font-bold text-text">{cls.section}</p>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 text-sm text-accent border border-accent/30 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  View Class →
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
