import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function AdminSettings() {
  return (
    <div>
      <Topbar title="Settings" subtitle="System settings" showSearch={false} />
      <Card><CardHeader><CardTitle>System Settings</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Settings coming soon.</p></CardContent></Card>
    </div>
  );
}
