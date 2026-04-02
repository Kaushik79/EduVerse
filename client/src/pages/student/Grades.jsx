import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function StudentGrades() {
  return (
    <div>
      <Topbar title="Grades" subtitle="Your academic grades" showSearch={false} />
      <Card><CardHeader><CardTitle>Grade Report</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Grades coming soon.</p></CardContent></Card>
    </div>
  );
}
