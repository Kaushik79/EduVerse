import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatCard } from '../../components/shared/StatCard';
import { Users, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <Topbar title="Dashboard" subtitle="System overview and management" showSearch={false} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value="1,284" change="+12" changeType="positive" icon={Users} />
        <StatCard title="Verified Users" value="1,156" icon={UserCheck} />
        <StatCard title="Pending Verification" value="28" icon={ShieldCheck} />
        <StatCard title="Active Issues" value="3" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent><p className="text-text-secondary">System activity log coming soon.</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
          <CardContent><p className="text-text-secondary">System health metrics coming soon.</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
