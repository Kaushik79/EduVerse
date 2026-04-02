import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function TeacherSettings() {
  return (
    <div>
      <Topbar title="Settings" subtitle="Manage your preferences" showSearch={false} />
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">Settings management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
