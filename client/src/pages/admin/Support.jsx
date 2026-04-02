import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function Support() {
  return (
    <div>
      <Topbar title="Support" subtitle="Help and support resources" showSearch={false} />
      <Card><CardHeader><CardTitle>Support Center</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Support center coming soon.</p></CardContent></Card>
    </div>
  );
}
