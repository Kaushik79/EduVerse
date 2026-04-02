import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function TeacherAssignments() {
  return (
    <div>
      <Topbar title="Assignments" subtitle="Create and manage assignments" showSearch={false} />
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">Assignment management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
