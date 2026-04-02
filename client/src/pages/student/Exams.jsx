import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function StudentExams() {
  return (
    <div>
      <Topbar title="Exams" subtitle="Upcoming and past exams" showSearch={false} />
      <Card><CardHeader><CardTitle>Exam Schedule</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Exams coming soon.</p></CardContent></Card>
    </div>
  );
}
