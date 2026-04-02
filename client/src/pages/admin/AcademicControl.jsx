import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function AcademicControl() {
  return (
    <div>
      <Topbar title="Academic Control" subtitle="Manage academic settings and policies" showSearch={false} />
      <Card><CardHeader><CardTitle>Academic Settings</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Academic control coming soon.</p></CardContent></Card>
    </div>
  );
}
