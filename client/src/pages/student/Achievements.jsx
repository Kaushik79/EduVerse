import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import { Trophy, Code2, Award, Briefcase, GraduationCap, ExternalLink, Zap, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function StudentAchievements() {
  const { user } = useAuth();
  const [leetcode, setLeetcode] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    api.get('/leetcode/my').then(r => setLeetcode(r.data)).catch(() => {});
    api.get('/achievements/my').then(r => setAchievements(r.data)).catch(() => {});
  }, []);

  const handleRefreshLeetcode = async () => {
    setRefreshing(true);
    try {
      const r = await api.post('/leetcode/refresh');
      setLeetcode(r.data);
    } catch (e) {}
    setRefreshing(false);
  };

  const lcData = leetcode || { totalSolved: 312, easySolved: 145, mediumSolved: 132, hardSolved: 35, totalEasy: 800, totalMedium: 1700, totalHard: 750, ranking: 85432, streak: 28 };
  const total = lcData.easySolved + lcData.mediumSolved + lcData.hardSolved;

  const mockAchievements = achievements.length > 0 ? achievements : [
    { id: 1, title: 'Winner - HackTech 2024', type: 'hackathon', issuer: 'HackTech', dateAchieved: '2024-03-15', description: 'First place in the ML track at HackTech 2024.' },
    { id: 2, title: 'AWS Cloud Practitioner', type: 'certification', issuer: 'Amazon Web Services', dateAchieved: '2024-06-01', description: 'AWS Certified Cloud Practitioner.' },
    { id: 3, title: 'SDE Intern at Microsoft', type: 'internship', issuer: 'Microsoft', dateAchieved: '2024-05-15', description: 'Summer internship on Azure DevOps team.' },
  ];

  const typeIcons = { hackathon: Trophy, certification: Award, internship: Briefcase, publication: GraduationCap, award: Trophy, other: Award };
  const typeColors = { hackathon: 'text-emerald-600 bg-emerald-50', certification: 'text-blue-600 bg-blue-50', internship: 'text-violet-600 bg-violet-50', award: 'text-amber-600 bg-amber-50' };

  return (
    <div>
      <Topbar title="Achievements & Profile" subtitle="Showcase your skills and track your progress" showSearch={false} />

      {/* Profile Links */}
      <div className="flex flex-wrap gap-3 mb-6">
        {user?.leetcodeUsername && (
          <a href={`https://leetcode.com/u/${user.leetcodeUsername}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors">
            <Code2 size={16} /> LeetCode: {user.leetcodeUsername} <ExternalLink size={14} />
          </a>
        )}
        {user?.linkedinUrl && (
          <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            LinkedIn Profile <ExternalLink size={14} />
          </a>
        )}
        {user?.githubUsername && (
          <a href={`https://github.com/${user.githubUsername}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            GitHub: {user.githubUsername} <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* LeetCode Stats Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code2 size={20} className="text-amber-500" />
            LeetCode Statistics
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefreshLeetcode} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="14" />
                  {total > 0 && (
                    <>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#34d399" strokeWidth="14"
                        strokeDasharray={`${(lcData.easySolved / total) * 251.2} 251.2`} strokeLinecap="round" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#fbbf24" strokeWidth="14"
                        strokeDasharray={`${(lcData.mediumSolved / total) * 251.2} 251.2`}
                        strokeDashoffset={`-${(lcData.easySolved / total) * 251.2}`} strokeLinecap="round" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f87171" strokeWidth="14"
                        strokeDasharray={`${(lcData.hardSolved / total) * 251.2} 251.2`}
                        strokeDashoffset={`-${((lcData.easySolved + lcData.mediumSolved) / total) * 251.2}`} strokeLinecap="round" />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-text">{lcData.totalSolved}</span>
                  <span className="text-xs text-text-muted">total solved</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600">{lcData.easySolved}</p>
                  <p className="text-xs text-emerald-600 font-medium">Easy</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <p className="text-2xl font-bold text-amber-600">{lcData.mediumSolved}</p>
                  <p className="text-xs text-amber-600 font-medium">Medium</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-xl">
                  <p className="text-2xl font-bold text-red-500">{lcData.hardSolved}</p>
                  <p className="text-xs text-red-500 font-medium">Hard</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-amber-500" />
                  <span className="text-sm font-semibold">{lcData.streak} day streak</span>
                </div>
                <span className="text-sm text-text-muted">Rank: #{lcData.ranking?.toLocaleString()}</span>
              </div>
              {/* Progress bars */}
              {[
                { label: 'Easy', solved: lcData.easySolved, total: lcData.totalEasy, color: 'bg-emerald-400' },
                { label: 'Medium', solved: lcData.mediumSolved, total: lcData.totalMedium, color: 'bg-amber-400' },
                { label: 'Hard', solved: lcData.hardSolved, total: lcData.totalHard, color: 'bg-red-400' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">{item.label}</span>
                    <span className="text-text-muted">{item.solved}/{item.total}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.solved / item.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            Achievements & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAchievements.map((ach) => {
              const Icon = typeIcons[ach.type] || Award;
              const colors = typeColors[ach.type] || 'text-gray-600 bg-gray-50';
              return (
                <div key={ach.id} className="flex items-start gap-4 p-4 border border-border rounded-xl hover:border-accent/30 transition-colors">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors}`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-text">{ach.title}</p>
                        <p className="text-xs text-text-muted mt-0.5">{ach.issuer} • {new Date(ach.dateAchieved).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                      </div>
                      <Badge variant={ach.type === 'hackathon' ? 'success' : ach.type === 'certification' ? 'info' : 'warning'}>
                        {ach.type}
                      </Badge>
                    </div>
                    {ach.description && <p className="text-xs text-text-secondary mt-1.5">{ach.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
