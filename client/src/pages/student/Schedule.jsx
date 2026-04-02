import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function StudentSchedule() {
  return (
    <div>
      <Topbar title="Schedule" subtitle="Your class schedule" showSearch={false} />
      <Card><CardHeader><CardTitle>Weekly Schedule</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Schedule coming soon.</p></CardContent></Card>
    </div>
  );
}
