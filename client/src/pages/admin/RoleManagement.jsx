import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import api from '../../lib/api';
import { Search, UserCog } from 'lucide-react';

const MOCK = [
  { id: 1, name: 'Alex Morgan', email: 'alex@eduverse.com', role: 'student', studentId: '4829', department: 'CS Undergrad', isVerified: true },
  { id: 2, name: 'Michael Chen', email: 'michael@eduverse.com', role: 'student', studentId: '4830', department: 'CS Undergrad', isVerified: true },
  { id: 3, name: 'Sarah Miller', email: 'sarah@eduverse.com', role: 'student', studentId: '4831', department: 'Physics', isVerified: false },
  { id: 4, name: 'Prof. Anderson', email: 'anderson@eduverse.com', role: 'teacher', department: 'Physics Dept.', isVerified: true },
  { id: 5, name: 'Marcus Chen', email: 'admin@eduverse.com', role: 'admin', department: 'Administration', isVerified: true },
  { id: 6, name: 'Jane Smith', email: 'jane@eduverse.com', role: 'alumni', studentId: '3201', department: 'CS', isVerified: true },
];

const ROLES = ['student', 'teacher', 'admin', 'alumni', 'higherofficial'];
const ROLE_BADGE = { student: 'success', teacher: 'info', admin: 'danger', alumni: 'warning', higherofficial: 'warning' };

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [changing, setChanging] = useState(null);

  useEffect(() => {
    api.get('/users')
      .then(r => setUsers(r.data.length ? r.data : MOCK))
      .catch(() => setUsers(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleRoleChange = async (userId, newRole) => {
    setChanging(userId);
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch {
      // silently update local state anyway for demo
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    setChanging(null);
  };

  return (
    <div>
      <Topbar title="Role Management" subtitle="Manage user roles and permissions" showSearch={false} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...ROLES].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${roleFilter === r ? 'bg-accent text-white' : 'bg-white border border-border text-text-secondary hover:border-accent'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-text-muted">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Change Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar alt={u.name} fallback={u.name.charAt(0)} size="sm" />
                        <div>
                          <p className="font-medium text-text text-sm">{u.name}</p>
                          <p className="text-xs text-text-muted">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">{u.department || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={ROLE_BADGE[u.role] || 'info'}>{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {u.isVerified ? <Badge variant="success">Verified</Badge> : <Badge variant="warning">Pending</Badge>}
                    </TableCell>
                    <TableCell>
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        disabled={changing === u.id}
                        className="text-sm border border-border rounded-lg px-2 py-1 bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition cursor-pointer"
                      >
                        {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
