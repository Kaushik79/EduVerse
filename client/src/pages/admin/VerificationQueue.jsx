import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import api from '../../lib/api';
import { ShieldCheck, Check, X } from 'lucide-react';

const MOCK = [
  { id: 3, name: 'Sarah Miller', email: 'sarah@eduverse.com', role: 'student', department: 'Physics', studentId: '4831' },
];

export default function VerificationQueue() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    api.get('/users')
      .then(r => {
        const unver = r.data.filter(u => !u.isVerified);
        setPending(unver.length ? unver : MOCK);
      })
      .catch(() => setPending(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (userId) => {
    setProcessing(userId);
    try {
      await api.put(`/users/${userId}/verify`);
    } catch { }
    setPending(prev => prev.filter(u => u.id !== userId));
    setProcessing(null);
  };

  const handleReject = (userId) => {
    setPending(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <div>
      <Topbar title="Verification Queue" subtitle={`${pending.length} users pending verification`} showSearch={false} />

      {loading ? (
        <div className="flex items-center justify-center h-48 text-text-muted">Loading…</div>
      ) : pending.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <ShieldCheck size={32} className="text-success" />
            </div>
            <p className="font-semibold text-text">All caught up!</p>
            <p className="text-sm text-text-muted">No users pending verification</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pending.map(u => (
            <Card key={u.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar alt={u.name} fallback={u.name.charAt(0)} />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-text">{u.name}</h3>
                        <Badge variant={u.role === 'teacher' ? 'info' : 'success'}>{u.role}</Badge>
                      </div>
                      <p className="text-sm text-text-muted">{u.email}</p>
                      <p className="text-xs text-text-muted mt-0.5">{u.department}{u.studentId ? ` • ID: ${u.studentId}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReject(u.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-danger text-danger text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <X size={15} /> Reject
                    </button>
                    <button
                      onClick={() => handleVerify(u.id)}
                      disabled={processing === u.id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-success text-white text-sm font-medium hover:bg-success-light transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Check size={15} /> {processing === u.id ? 'Verifying…' : 'Verify'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
