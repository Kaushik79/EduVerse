import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function VerificationQueue() {
  return (
    <div>
      <Topbar title="Verification Queue" subtitle="Pending user verifications" showSearch={false} />
      <Card><CardHeader><CardTitle>Pending Verifications</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Verification queue coming soon.</p></CardContent></Card>
    </div>
  );
}
