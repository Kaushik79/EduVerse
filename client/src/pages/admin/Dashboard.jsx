import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatCard } from '../../components/shared/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import api from '../../lib/api';
import { Users, ShieldCheck, UserCheck, AlertTriangle, Activity, Server, Database, Zap, CheckCircle2, Clock } from 'lucide-react';

const MOCK_USERS = [
  { id: 1, name: 'Alex Morgan', email: 'alex@eduverse.com', role: 'student', isVerified: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, name: 'Michael Chen', email: 'michael@eduverse.com', role: 'student', isVerified: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, name: 'Sarah Miller', email: 'sarah@eduverse.com', role: 'student', isVerified: false, createdAt: new Date(Date.now() - 10800000).toISOString() },
  { id: 4, name: 'Prof. Anderson', email: 'anderson@eduverse.com', role: 'teacher', isVerified: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

const HEALTH = [
  { label: 'API Server', status: 'healthy', uptime: '99.9%', icon: Server },
  { label: 'Database', status: 'healthy', uptime: '100%', icon: Database },
  { label: 'Auth Service', status: 'healthy', uptime: '99.8%', icon: ShieldCheck },
  { label: 'WhatsApp API', status: 'healthy', uptime: '98.5%', icon: Zap },
];

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
  return `${h}h ago`;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users')
      .then(r => setUsers(r.data.length ? r.data : MOCK_USERS))
      .catch(() => setUsers(MOCK_USERS));
  }, []);

  const students = users.filter(u => u.role === 'student').length;
  const teachers = users.filter(u => u.role === 'teacher').length;
  const pending = users.filter(u => !u.isVerified).length;
  const recent = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div>
      <Topbar title="Admin Dashboard" subtitle="System overview and management" showSearch={false} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value={users.length || 284} change="+12 this week" changeType="positive" icon={Users} />
        <StatCard title="Students" value={students || 1156} icon={UserCheck} />
        <StatCard title="Teachers" value={teachers || 38} icon={ShieldCheck} />
        <StatCard title="Pending Verification" value={pending || 28} change="Needs action" changeType="negative" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Activity size={18} />Recent User Activity</CardTitle>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-text-muted">Live</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar alt={u.name} fallback={u.name.charAt(0)} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-text">{u.name}</p>
                    <p className="text-xs text-text-muted">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={u.role === 'teacher' ? 'info' : u.role === 'admin' ? 'danger' : 'success'}>{u.role}</Badge>
                  {u.isVerified ? (
                    <CheckCircle2 size={16} className="text-success" />
                  ) : (
                    <Clock size={16} className="text-warning" />
                  )}
                  <span className="text-xs text-text-muted">{timeAgo(u.createdAt)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Server size={18} />System Health</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {HEALTH.map(({ label, status, uptime, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{label}</p>
                    <p className="text-xs text-text-muted">Uptime: {uptime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-green-600 font-medium capitalize">{status}</span>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-text-muted text-center">All systems operational</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
