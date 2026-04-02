import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function TeacherStudents() {
  return (
    <div>
      <Topbar title="Students" subtitle="View and manage students" />
      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">Student management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
