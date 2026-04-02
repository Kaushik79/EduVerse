import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function TeacherSchedule() {
  return (
    <div>
      <Topbar title="Schedule" subtitle="Your weekly schedule" showSearch={false} />
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">Schedule view coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
