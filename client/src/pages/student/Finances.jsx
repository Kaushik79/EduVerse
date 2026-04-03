import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import api from '../../lib/api';
import { Wallet, ArrowUpCircle, ArrowDownCircle, TrendingDown } from 'lucide-react';

const MOCK = [
  { id: 1, type: 'tuition', description: 'Fall 2024 Tuition', amount: 15000, dueDate: new Date(Date.now() + 2592000000).toISOString(), status: 'pending' },
  { id: 2, type: 'scholarship', description: 'Merit Scholarship', amount: -5000, dueDate: null, status: 'paid' },
];

export default function StudentFinances() {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/finances/my')
      .then(r => setFinances(r.data.length ? r.data : MOCK))
      .catch(() => setFinances(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const totalDue = finances.filter(f => f.status === 'pending' && f.amount > 0).reduce((s, f) => s + f.amount, 0);
  const totalPaid = finances.filter(f => f.status === 'paid').reduce((s, f) => s + Math.abs(f.amount), 0);

  return (
    <div>
      <Topbar title="Finances" subtitle="Fee details and payment history" showSearch={false} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingDown size={20} />
              </div>
              <div>
                <p className="text-white/70 text-sm">Total Due</p>
                <p className="text-2xl font-bold">₹{totalDue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-white/70 text-sm">Total Paid / Credits</p>
                <p className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-text-muted text-sm mb-1">Net Balance</p>
            <p className="text-2xl font-bold text-text">₹{(totalDue - totalPaid).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-text-muted">Loading…</div>
          ) : finances.map(f => (
            <div key={f.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${f.amount < 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-danger'}`}>
                  {f.amount < 0 ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                </div>
                <div>
                  <p className="font-medium text-text text-sm">{f.description}</p>
                  <p className="text-xs text-text-muted capitalize">{f.type}{f.dueDate ? ` • Due ${new Date(f.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${f.amount < 0 ? 'text-green-600' : 'text-danger'}`}>
                  {f.amount < 0 ? '-' : '+'}₹{Math.abs(f.amount).toLocaleString()}
                </p>
                <Badge variant={f.status === 'paid' ? 'success' : 'warning'}>{f.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
