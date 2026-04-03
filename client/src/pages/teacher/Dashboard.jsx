import { useState, useEffect, useCallback } from 'react';
import MessagingModal from './MessagingModal';
import { Topbar } from '../../components/layout/Topbar';
import { StatCard } from '../../components/shared/StatCard';
import { ActivityFeed } from '../../components/shared/ActivityFeed';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Toggle } from '../../components/ui/Toggle';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import {
  Users, BarChart3, Clock, Upload, Megaphone, MessageSquare,
  X, Check, FileText, RefreshCw, Plus, AlertCircle
} from 'lucide-react';

// ── Announcement Modal ─────────────────────────────────────────────────────────
function AnnouncementModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', content: '', targetRole: 'all', priority: 'normal' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/announcements', form);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <Megaphone size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text">Post Announcement</h2>
              <p className="text-xs text-text-muted">Broadcast to students or all users</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-gray-100 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Title *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Announcement title…"
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Message *</label>
            <textarea required rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Write your announcement…"
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Audience</label>
              <select value={form.targetRole} onChange={e => setForm(f => ({ ...f, targetRole: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition cursor-pointer">
                <option value="all">All Users</option>
                <option value="student">Students Only</option>
                <option value="teacher">Teachers Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition cursor-pointer">
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="text-sm text-text-muted hover:text-text transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-60">
              <Megaphone size={15} /> {loading ? 'Posting…' : 'Post Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const { user } = useAuth();
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Live data
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  const [processing, setProcessing] = useState(null);

  const fetchLeaves = useCallback(async () => {
    setLoadingLeaves(true);
    try {
      const r = await api.get('/leaves');
      // Teacher sees all; filter to pending only for dashboard
      setLeaveRequests(r.data.filter(l => l.status === 'pending'));
    } catch {
      setLeaveRequests([
        { id: 1, type: 'od', reason: 'Sports Meet - 2 days', student: { name: 'Michael Chen' }, status: 'pending', fromDate: new Date().toISOString(), toDate: new Date(Date.now() + 172800000).toISOString() },
        { id: 2, type: 'medical', reason: 'Medical Appointment', student: { name: 'Sarah Miller' }, status: 'pending', fromDate: new Date().toISOString(), toDate: new Date(Date.now() + 86400000).toISOString() },
      ]);
    } finally {
      setLoadingLeaves(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
    api.get('/assignments').then(r => setAssignments(r.data)).catch(() => setAssignments([
      { id: 1, title: 'Mid-Term Lab Report', dueDate: new Date(Date.now() - 86400000).toISOString(), course: { name: 'Physics 101', code: 'PHY101' }, submissions: Array(12).fill({ status: 'submitted' }), status: 'active' },
      { id: 2, title: 'Quantum Mechanics Essay', dueDate: new Date(Date.now() - 172800000).toISOString(), course: { name: 'Physics 302', code: 'PHY302' }, submissions: Array(5).fill({ status: 'submitted' }), status: 'active' },
      { id: 3, title: 'Weekly Problem Set 4', dueDate: new Date().toISOString(), course: { name: 'Physics 101', code: 'PHY101' }, submissions: [], status: 'draft' },
    ]));
    api.get('/users?role=student').then(r => setStudents(r.data)).catch(() => { });
  }, [fetchLeaves]);

  const typeLabel = { od: '📋 OD', gatepass: '🚪 Gate Pass', leave: '🏖 Leave', medical: '🏥 Medical' };

  const handleLeaveAction = async (id, status) => {
    setProcessing(id + status);
    try {
      await api.put(`/leaves/${id}/status`, { status });
      await fetchLeaves();
    } catch {
      setLeaveRequests(prev => prev.filter(l => l.id !== id));
    } finally {
      setProcessing(null);
    }
  };

  function formatDue(d) {
    const diff = new Date(d) - Date.now();
    if (diff < 0) {
      const days = Math.floor(-diff / 86400000);
      return days === 0 ? 'Due Yesterday' : `${days}d ago`;
    }
    return 'Due Today';
  }

  return (
    <div>
      <Topbar
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name?.split(' ')[0] || 'Professor'}! You have ${leaveRequests.length} pending requests.`}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary"><Upload size={16} />Upload Materials</Button>
          </div>
        }
      />

      {/* Post Announcement */}
      <div className="mb-6 flex items-center gap-3">
        <Button variant="default" className="bg-primary text-white" onClick={() => setShowAnnouncementModal(true)}>
          <Megaphone size={16} />Post Announcement
        </Button>
        <button onClick={() => fetchLeaves()}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors cursor-pointer">
          <RefreshCw size={14} />Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Students" value={students.length || 142} change="+2%" changeType="positive" icon={Users} />
        <StatCard title="Avg Attendance" value="88%" change="+1.5%" changeType="positive" icon={BarChart3} />
        <StatCard title="Pending Requests" value={leaveRequests.length} change={leaveRequests.length > 0 ? 'Needs review' : 'All clear'} changeType={leaveRequests.length > 0 ? 'negative' : 'positive'} icon={Clock} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Assignment Reviews */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">📋</span>Pending Assignment Reviews
            </CardTitle>
            <button className="text-sm text-accent hover:text-accent-light font-medium transition-colors cursor-pointer">View all</button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.slice(0, 3).map((a, i) => (
                  <TableRow key={a.id || i}>
                    <TableCell>
                      <p className="font-medium text-text">{a.title}</p>
                    </TableCell>
                    <TableCell className="text-text-secondary text-sm">{a.course?.name || a.class}</TableCell>
                    <TableCell className="text-xs text-text-muted">{formatDue(a.dueDate)}</TableCell>
                    <TableCell>
                      {(a.submissions || []).length > 0 ? (
                        <Badge variant="success">{(a.submissions || []).length} Submitted</Badge>
                      ) : (
                        <span className="text-text-muted text-sm">Awaiting</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {a.status === 'active' && (a.submissions || []).length > 0 ? (
                        <button className="text-sm text-accent hover:text-accent-light font-medium transition-colors cursor-pointer">Grade Now</button>
                      ) : (
                        <span className="text-sm text-text-muted">Locked</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* WhatsApp Reminders Card */}
        <div className="bg-whatsapp rounded-xl p-5 text-white relative overflow-hidden flex flex-col">
          <div className="absolute top-3 right-3">
            <Badge variant="active" className="text-[10px] px-2 py-0.5">ACTIVE</Badge>
          </div>
          <div className="mb-4 mt-2"><MessageSquare size={28} className="text-white/80" /></div>
          <h3 className="text-lg font-bold mb-1">Automated WhatsApp Reminders</h3>
          <p className="text-sm text-white/70 mb-4">Send alerts to students with late submissions instantly.</p>
          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-xs text-white/50 uppercase tracking-wider">Auto-Remind</span>
              <div className="mt-1"><Toggle checked={whatsappEnabled} onChange={setWhatsappEnabled} /></div>
            </div>
            <button onClick={() => setShowMessagingModal(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer">
              <MessageSquare size={15} />Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Live OD / Leave Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              OD / Leave Requests
              {leaveRequests.length > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
                  {leaveRequests.length}
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-text-muted">Live</span>
            </div>
          </CardHeader>
          <CardContent>
            {loadingLeaves ? (
              <div className="flex items-center justify-center h-20 text-text-muted text-sm">Loading requests…</div>
            ) : leaveRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-text-muted">
                <FileText size={28} />
                <p className="text-sm">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaveRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar alt={req.student?.name} fallback={(req.student?.name || 'S').charAt(0)} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-text">{req.student?.name || 'Student'}</p>
                        <p className="text-xs text-text-muted">{typeLabel[req.type] || req.type} • {req.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={!!processing}
                        onClick={() => handleLeaveAction(req.id, 'rejected')}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-danger hover:border-danger transition-colors cursor-pointer disabled:opacity-40"
                      >
                        <X size={15} />
                      </button>
                      <button
                        disabled={!!processing}
                        onClick={() => handleLeaveAction(req.id, 'approved')}
                        className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white hover:bg-success-light transition-colors cursor-pointer disabled:opacity-40"
                      >
                        <Check size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Activity Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">📈</span>Student Activity Feed
            </CardTitle>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-text-muted">Live</span>
            </div>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={[
              { title: 'New Submission: Physics Lab', description: 'David Kim uploaded report_final.pdf', time: '2m ago', type: 'submission' },
              { title: 'Forum Question', description: 'Emma Watson asked in Week 4 Discussion', time: '15m ago', type: 'question' },
              { title: 'Material Accessed', description: '15 students viewed "Chapter 5 Notes"', time: '1h ago', type: 'access' },
            ]} />
          </CardContent>
        </Card>
      </div>

      {showMessagingModal && <MessagingModal onClose={() => setShowMessagingModal(false)} />}
      {showAnnouncementModal && (
        <AnnouncementModal
          onClose={() => setShowAnnouncementModal(false)}
          onCreated={() => { }}
        />
      )}
    </div>
  );
}
