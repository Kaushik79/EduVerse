import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function StudentFinances() {
  return (
    <div>
      <Topbar title="Finances" subtitle="Tuition, fees, and scholarships" showSearch={false} />
      <Card><CardHeader><CardTitle>Financial Overview</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Finances coming soon.</p></CardContent></Card>
    </div>
  );
}
