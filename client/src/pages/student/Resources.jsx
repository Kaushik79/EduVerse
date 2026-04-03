import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import api from '../../lib/api';
import { FolderOpen, Download, FileText, Film, Code } from 'lucide-react';

const MOCK = [
  { id: 1, title: 'Chapter 5 Notes', description: 'Lecture notes for Chapter 5', fileType: 'pdf', fileUrl: '#', course: { name: 'Physics 101', code: 'PHY101' } },
  { id: 2, title: 'Lab Manual', description: 'Physics lab manual for all experiments', fileType: 'pdf', fileUrl: '#', course: { name: 'Physics 101', code: 'PHY101' } },
  { id: 3, title: 'Python Basics Slides', description: 'Introduction to Python programming', fileType: 'pdf', fileUrl: '#', course: { name: 'CS 101', code: 'CS101' } },
];

const FILE_ICONS = { pdf: FileText, video: Film, code: Code };
const FILE_COLORS = { pdf: 'bg-red-50 text-red-500', video: 'bg-blue-50 text-blue-500', code: 'bg-green-50 text-green-500' };

export default function StudentResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resources')
      .then(r => setResources(r.data.length ? r.data : MOCK))
      .catch(() => setResources(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const byCourse = resources.reduce((acc, r) => {
    const key = r.course?.name || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <div>
      <Topbar title="Resources" subtitle="Study materials and lecture notes" showSearch={false} />

      {loading ? (
        <div className="flex items-center justify-center h-48 text-text-muted">Loading…</div>
      ) : Object.keys(byCourse).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-text-muted gap-2">
          <FolderOpen size={32} />
          <p>No resources available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byCourse).map(([courseName, items]) => (
            <div key={courseName}>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">{courseName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(res => {
                  const Icon = FILE_ICONS[res.fileType] || FileText;
                  const color = FILE_COLORS[res.fileType] || 'bg-gray-50 text-gray-500';
                  return (
                    <Card key={res.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-text text-sm truncate">{res.title}</p>
                            <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{res.description}</p>
                            <div className="flex items-center justify-between mt-3">
                              <Badge variant="info">{res.fileType?.toUpperCase()}</Badge>
                              <a href={res.fileUrl} className="flex items-center gap-1 text-xs text-accent hover:text-accent-light font-medium cursor-pointer">
                                <Download size={12} /> Download
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
