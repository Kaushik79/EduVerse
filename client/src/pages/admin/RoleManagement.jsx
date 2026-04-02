import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function RoleManagement() {
  return (
    <div>
      <Topbar title="Role Management" subtitle="Manage user roles and permissions" showSearch={false} />
      <Card><CardHeader><CardTitle>User Roles</CardTitle></CardHeader><CardContent><p className="text-text-secondary">Role management coming soon.</p></CardContent></Card>
    </div>
  );
}
