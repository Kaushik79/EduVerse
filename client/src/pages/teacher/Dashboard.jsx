import { useState, useEffect } from 'react';
import api from '../../lib/api';
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
import {
  Users, BarChart3, Clock, Upload, Megaphone, MessageSquare,
  X, Check
} from 'lucide-react';

const mockAssignments = [
  { title: 'Mid-Term Lab Report', due: 'Due: Yesterday', class: 'Physics 101', submitted: 12, status: 'submitted', action: 'Grade Now' },
  { title: 'Quantum Mechanics Essay', due: 'Due: 2 Days ago', class: 'Physics 302', submitted: 5, status: 'submitted', action: 'Grade Now' },
  { title: 'Weekly Problem Set 4', due: 'Due: Today', class: 'Physics 101', submitted: 0, status: 'awaiting', action: 'Locked' },
];

const mockOdRequests = [
  { name: 'Michael Chen', reason: 'Sports Meet - 2 ...', avatar: null },
  { name: 'Sarah Miller', reason: 'Medical Leave - ...', avatar: null },
];

const mockActivities = [
  { title: 'New Submission: Physics Lab', description: 'David Kim uploaded report_final.pdf', time: '2m ago', type: 'submission' },
  { title: 'Forum Question', description: 'Emma Watson asked in Week 4 Discussion', time: '15m ago', type: 'question' },
  { title: 'Material Accessed', description: '15 students viewed "Chapter 5 Notes"', time: '1h ago', type: 'access' },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [session, setSession] = useState({ status: 'LOCKED', loading: true });
  const [leaderboard, setLeaderboard] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const fetchLeaderboard = () => {
    api.get('/teacher/leaderboard')
      .then(res => setLeaderboard(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    api.get('/session')
      .then(res => setSession({ status: res.data.status, loading: false }))
      .catch(console.error);

    fetchLeaderboard();
  }, []);

  const handleSyncLeetcode = async () => {
    try {
      setSyncing(true);
      await api.get('/leetcode/sync-all');
      fetchLeaderboard();
    } catch (error) {
      console.error('Failed to sync LeetCode mapping', error);
    } finally {
      setSyncing(false);
    }
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const handleToggleSession = async () => {
    try {
      setSession(prev => ({ ...prev, loading: true }));
      const res = await api.post('/session/toggle');
      setSession({ status: res.data.status, loading: false });
    } catch (error) {
      console.error(error);
      setSession(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div>
      <Topbar
        title="Dashboard"
        subtitle={`Welcome back, Professor! You have 4 priority items today.`}
        actions={
          <div className="flex items-center gap-3">
            <Button 
                onClick={handleToggleSession}
                disabled={session.loading}
                className={`font-bold tracking-wider transition-colors ${session.status === 'ACTIVE' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
            >
              {session.loading ? 'UPDATING...' : session.status === 'ACTIVE' ? 'STOP EXAM' : 'START EXAM'}
            </Button>
            <Button variant="secondary">
              <Upload size={16} />
              Upload Materials
            </Button>
          </div>
        }
      />

      {/* Post Announcement */}
      <div className="mb-6">
        <Button variant="default" className="bg-primary">
          <Megaphone size={16} />
          Post Announcement
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Students"
          value="142"
          change="+2%"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Avg Attendance"
          value="88%"
          change="+1.5%"
          changeType="positive"
          icon={BarChart3}
        />
        <StatCard
          title="Upcoming Deadlines"
          value="4"
          change="Next: Today 5PM"
          changeType="positive"
          icon={Clock}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Assignment Reviews - spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              Pending Assignment Reviews
            </CardTitle>
            <button className="text-sm text-accent hover:text-accent-light font-medium transition-colors cursor-pointer">
              View all
            </button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssignments.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-text">{item.title}</p>
                        <p className="text-xs text-text-muted">{item.due}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary">{item.class}</TableCell>
                    <TableCell>
                      {item.status === 'submitted' ? (
                        <Badge variant="success">{item.submitted} Submitted</Badge>
                      ) : (
                        <span className="text-text-muted text-sm">Awaiting</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.action === 'Grade Now' ? (
                        <button className="text-sm text-accent hover:text-accent-light font-medium transition-colors cursor-pointer">
                          Grade Now
                        </button>
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
        <div className="bg-whatsapp rounded-xl p-5 text-white relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <Badge variant="active" className="text-[10px] px-2 py-0.5">ACTIVE</Badge>
          </div>
          <div className="mb-4 mt-2">
            <MessageSquare size={28} className="text-white/80" />
          </div>
          <h3 className="text-lg font-bold mb-1">Automated WhatsApp Reminders</h3>
          <p className="text-sm text-white/70 mb-6">
            Send alerts to students with late submissions instantly.
          </p>
          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-xs text-white/50 uppercase tracking-wider">Queue</span>
              <p className="text-2xl font-bold">5 Messages</p>
            </div>
            <Toggle checked={whatsappEnabled} onChange={setWhatsappEnabled} />
          </div>
        </div>
      </div>

      {/* Bottom Row - Leaderboard */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">🏆</span>
              Class LeetCode Leaderboard
            </CardTitle>
            <Button 
                onClick={handleSyncLeetcode} 
                disabled={syncing}
                variant="outline" 
                className="text-xs h-8 px-3"
            >
              {syncing ? 'Syncing...' : 'Sync Live Stats'}
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center text-emerald-600">Easy</TableHead>
                  <TableHead className="text-center text-amber-500">Medium</TableHead>
                  <TableHead className="text-center text-red-500">Hard</TableHead>
                  <TableHead className="text-right">Total Solved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium text-lg">{getMedal(index)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar alt={student.name} fallback={student.name?.charAt(0) || '?'} />
                        <div>
                          <p className="font-medium text-text">{student.name}</p>
                          <p className="text-xs text-text-muted">@{student.leetcodeHandle || 'N/A'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{student.easySolved}</TableCell>
                    <TableCell className="text-center font-medium">{student.mediumSolved}</TableCell>
                    <TableCell className="text-center font-medium">{student.hardSolved}</TableCell>
                    <TableCell className="text-right font-bold text-accent">{student.totalSolved}</TableCell>
                  </TableRow>
                ))}
                {leaderboard.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-text-muted py-8">
                      No student data available. Please sync LeetCode stats.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 mt-6">
        {/* Student Activity Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">📈</span>
              Student Activity Feed
            </CardTitle>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-text-muted">Live</span>
            </div>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={mockActivities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
