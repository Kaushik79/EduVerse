import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function StudentCourses() {
  return (
    <div>
      <Topbar title="Courses" subtitle="Your enrolled courses" showSearch={false} />
      <Card><CardHeader><CardTitle>My Courses</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Courses coming soon.</p></CardContent></Card>
    </div>
  );
}
