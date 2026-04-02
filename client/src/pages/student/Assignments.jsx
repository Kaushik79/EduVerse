import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function StudentAssignments() {
  return (
    <div>
      <Topbar title="Assignments" subtitle="View and submit assignments" showSearch={false} />
      <Card><CardHeader><CardTitle>My Assignments</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Assignments coming soon.</p></CardContent></Card>
    </div>
  );
}
