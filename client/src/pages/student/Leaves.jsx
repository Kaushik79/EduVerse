import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import { FileText, Clock, CheckCircle, XCircle, Plus, Send } from 'lucide-react';

const typeLabels = { od: '📋 On Duty', gatepass: '🚪 Gate Pass', leave: '🏖 Leave', medical: '🏥 Medical' };
const statusConfig = { pending: { variant: 'warning', icon: Clock }, approved: { variant: 'success', icon: CheckCircle }, rejected: { variant: 'destructive', icon: XCircle } };

export default function StudentLeaves() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'od', reason: '', description: '', fromDate: '', toDate: '' });
  const [tab, setTab] = useState('all');

  useEffect(() => {
    api.get('/leaves').then(r => setRequests(r.data)).catch(() => {
      setRequests([
        { id: 1, type: 'od', reason: 'Hackathon Participation', description: 'Attending HackFest 2025 at IIT Madras', fromDate: new Date(Date.now() + 86400000).toISOString(), toDate: new Date(Date.now() + 259200000).toISOString(), status: 'approved', createdAt: new Date().toISOString() },
        { id: 2, type: 'gatepass', reason: 'Family Emergency', fromDate: new Date().toISOString(), toDate: new Date().toISOString(), status: 'pending', createdAt: new Date().toISOString() },
        { id: 3, type: 'medical', reason: 'Medical Appointment', description: 'Scheduled dental surgery', fromDate: new Date(Date.now() + 432000000).toISOString(), toDate: new Date(Date.now() + 518400000).toISOString(), status: 'pending', createdAt: new Date().toISOString() },
      ]);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves', form);
      const r = await api.get('/leaves');
      setRequests(r.data);
      setShowForm(false);
      setForm({ type: 'od', reason: '', description: '', fromDate: '', toDate: '' });
    } catch (e) {}
  };

  const filtered = tab === 'all' ? requests : requests.filter(r => r.status === tab);

  return (
    <div>
      <Topbar title="OD / Leave / Gate Pass" subtitle="Apply for on-duty, leave, gate pass, or medical leave" showSearch={false} />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Requests', count: requests.length, color: 'bg-blue-50 text-blue-600' },
          { label: 'Pending', count: requests.filter(r => r.status === 'pending').length, color: 'bg-amber-50 text-amber-600' },
          { label: 'Approved', count: requests.filter(r => r.status === 'approved').length, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Rejected', count: requests.filter(r => r.status === 'rejected').length, color: 'bg-red-50 text-red-600' },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-xl ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['all', 'pending', 'approved', 'rejected'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer capitalize ${tab === t ? 'bg-white shadow-sm text-text' : 'text-text-muted hover:text-text'}`}>
              {t}
            </button>
          ))}
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> New Application
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="od">On Duty (OD)</option>
                  <option value="gatepass">Gate Pass</option>
                  <option value="leave">Leave</option>
                  <option value="medical">Medical Leave</option>
                </select>
              </div>
              <Input label="Reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Brief reason" required />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text mb-1.5">Description (optional)</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[60px]" placeholder="Additional details..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">From Date</label>
                <input type="date" value={form.fromDate} onChange={e => setForm({ ...form, fromDate: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">To Date</label>
                <input type="date" value={form.toDate} onChange={e => setForm({ ...form, toDate: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" required />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit"><Send size={14} /> Submit Application</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Request List */}
      <div className="space-y-3">
        {filtered.map((req) => {
          const cfg = statusConfig[req.status] || statusConfig.pending;
          const StatusIcon = cfg.icon;
          return (
            <Card key={req.id} className="hover:border-primary/20 transition-all">
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : req.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                    <StatusIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-sm font-semibold text-text">{req.reason}</p>
                        <p className="text-xs text-text-muted mt-0.5">{typeLabels[req.type] || req.type}</p>
                      </div>
                      <Badge variant={cfg.variant}>{req.status}</Badge>
                    </div>
                    {req.description && <p className="text-xs text-text-secondary mt-1.5">{req.description}</p>}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-text-muted">
                        {new Date(req.fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' → '}
                        {new Date(req.toDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-xs text-text-muted">Applied: {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FileText size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text mb-1">No requests found</h3>
          <p className="text-sm text-text-muted">Submit a new application to get started.</p>
        </div>
      )}
    </div>
  );
}
