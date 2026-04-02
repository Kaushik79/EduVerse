import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function StudentResources() {
  return (
    <div>
      <Topbar title="Resources" subtitle="Course materials and downloads" showSearch={false} />
      <Card><CardHeader><CardTitle>Learning Resources</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Resources coming soon.</p></CardContent></Card>
    </div>
  );
}
