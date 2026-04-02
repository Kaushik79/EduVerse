import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function StudentSettings() {
  return (
    <div>
      <Topbar title="Settings" subtitle="Manage your account" showSearch={false} />
      <Card><CardHeader><CardTitle>Account Settings</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Settings coming soon.</p></CardContent></Card>
    </div>
  );
}
