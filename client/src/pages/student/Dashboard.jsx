import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatCard } from '../../components/shared/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import {
  BookOpen, Calendar, TrendingUp, Code2, Trophy, FolderGit2,
  ArrowRight, Clock, Zap
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leetcode, setLeetcode] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    api.get('/leetcode/my').then(r => setLeetcode(r.data)).catch(() => {});
    api.get('/achievements/my').then(r => setAchievements(r.data)).catch(() => {});
    api.get('/projects/my').then(r => setProjects(r.data)).catch(() => {});
    api.get('/calendar').then(r => setEvents(r.data?.slice(0, 4) || [])).catch(() => {});
    api.get('/github/repos').then(r => setRepos(r.data)).catch(() => {});
  }, []);

  // Mock data for demo when API not available
  const lcData = leetcode || { totalSolved: 312, easySolved: 145, mediumSolved: 132, hardSolved: 35, streak: 28 };
  const total = lcData.easySolved + lcData.mediumSolved + lcData.hardSolved;

  return (
    <div>
      <Topbar
        title={`Welcome, ${user?.name || 'Student'}!`}
        subtitle={`Semester ${user?.semester || 5} • ${user?.department || 'CS'} • Batch ${user?.batch || '2022-2026'}`}
        showSearch={false}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Problems Solved" value={lcData.totalSolved} change={`🔥 ${lcData.streak} day streak`} changeType="positive" icon={Code2} />
        <StatCard title="Achievements" value={achievements.length || 3} icon={Trophy} />
        <StatCard title="Active Projects" value={projects.length || 2} icon={FolderGit2} />
        <StatCard title="Upcoming Events" value={events.length || 4} icon={Calendar} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LeetCode Overview - spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code2 size={20} className="text-amber-500" />
              LeetCode Progress
            </CardTitle>
            <a href="/student/achievements" className="text-sm text-accent hover:text-accent-light font-medium">View Full Profile →</a>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              {/* Pie Chart */}
              <div className="relative w-40 h-40 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {total > 0 && (
                    <>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#d1fae5" strokeWidth="12"
                        strokeDasharray={`${(lcData.easySolved / total) * 251.2} 251.2`} strokeDashoffset="0" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#fde68a" strokeWidth="12"
                        strokeDasharray={`${(lcData.mediumSolved / total) * 251.2} 251.2`}
                        strokeDashoffset={`-${(lcData.easySolved / total) * 251.2}`} />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#fecaca" strokeWidth="12"
                        strokeDasharray={`${(lcData.hardSolved / total) * 251.2} 251.2`}
                        strokeDashoffset={`-${((lcData.easySolved + lcData.mediumSolved) / total) * 251.2}`} />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-text">{lcData.totalSolved}</span>
                  <span className="text-xs text-text-muted">solved</span>
                </div>
              </div>

              {/* Stats Breakdown */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-emerald-600">Easy</span>
                    <span className="text-sm text-text-secondary">{lcData.easySolved} / {lcData.totalEasy || 800}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${(lcData.easySolved / (lcData.totalEasy || 800)) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-amber-600">Medium</span>
                    <span className="text-sm text-text-secondary">{lcData.mediumSolved} / {lcData.totalMedium || 1700}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(lcData.mediumSolved / (lcData.totalMedium || 1700)) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-red-500">Hard</span>
                    <span className="text-sm text-text-secondary">{lcData.hardSolved} / {lcData.totalHard || 750}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${(lcData.hardSolved / (lcData.totalHard || 750)) * 100}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Zap size={16} className="text-amber-500" />
                    <span className="text-sm font-semibold text-text">{lcData.streak} day streak</span>
                  </div>
                  <span className="text-xs text-text-muted">Rank: #{lcData.ranking?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} className="text-accent" />
              Upcoming
            </CardTitle>
            <a href="/student/calendar" className="text-sm text-accent hover:text-accent-light font-medium">View All →</a>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(events.length > 0 ? events : [
                { title: 'Physics 101 Midterm', type: 'exam', startDate: new Date(Date.now() + 604800000), color: '#ef4444' },
                { title: 'Lab Report Deadline', type: 'deadline', startDate: new Date(Date.now() + 259200000), color: '#f59e0b' },
                { title: 'Tech Club Workshop', type: 'club', startDate: new Date(Date.now() + 172800000), color: '#06b6d4' },
                { title: 'CS101 Assignment Due', type: 'assignment', startDate: new Date(Date.now() + 345600000), color: '#3b82f6' },
              ]).map((event, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-1 h-10 rounded-full" style={{ backgroundColor: event.color || '#3b82f6' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{event.title}</p>
                    <p className="text-xs text-text-muted">
                      {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' • '}{event.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Achievements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              Recent Achievements
            </CardTitle>
            <a href="/student/achievements" className="text-sm text-accent hover:text-accent-light font-medium">View All →</a>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(achievements.length > 0 ? achievements.slice(0, 3) : [
                { title: 'Winner - HackTech 2024', type: 'hackathon', issuer: 'HackTech', dateAchieved: '2024-03-15' },
                { title: 'AWS Cloud Practitioner', type: 'certification', issuer: 'Amazon Web Services', dateAchieved: '2024-06-01' },
                { title: 'SDE Intern at Microsoft', type: 'internship', issuer: 'Microsoft', dateAchieved: '2024-05-15' },
              ]).map((ach, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <Trophy size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{ach.title}</p>
                    <p className="text-xs text-text-muted">{ach.issuer} • {new Date(ach.dateAchieved).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  </div>
                  <Badge variant={ach.type === 'hackathon' ? 'success' : ach.type === 'certification' ? 'info' : 'warning'}>
                    {ach.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderGit2 size={20} className="text-violet-500" />
              My Projects
            </CardTitle>
            <a href="/student/projects" className="text-sm text-accent hover:text-accent-light font-medium">Browse All →</a>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(projects.length > 0 ? projects.slice(0, 3) : [
                { title: 'AI-Powered Study Planner', type: 'hackathon', status: 'recruiting', techStack: '["React","Node.js","OpenAI API"]' },
                { title: 'Smart Campus Navigation', type: 'senior_project', status: 'in_progress', techStack: '["React Native","Arduino","BLE"]' },
              ]).map((proj, i) => {
                const tech = typeof proj.techStack === 'string' ? JSON.parse(proj.techStack || '[]') : (proj.techStack || []);
                return (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-text">{proj.title}</p>
                      <Badge variant={proj.status === 'recruiting' ? 'info' : proj.status === 'in_progress' ? 'warning' : 'success'}>
                        {proj.status?.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tech.slice(0, 3).map((t, j) => (
                        <span key={j} className="px-2 py-0.5 text-[11px] bg-white border border-border rounded-md text-text-secondary">{t}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GitHub Repositories Row */}
      <div className="grid grid-cols-1 gap-6 mt-6 pb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderGit2 size={20} className="text-gray-800" />
              Repository Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {repos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {repos.map(repo => (
                  <div key={repo.name} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col h-full hover:shadow-sm transition-shadow">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-text mb-1 truncate" title={repo.name}>{repo.name}</h3>
                      <p className="text-sm text-text-muted mb-3 line-clamp-2">
                        {repo.description || 'No description available'}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {repo.language && (
                          <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-md">
                            {repo.language}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="pt-3 flex justify-between items-center border-t border-gray-200 gap-2">
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-xs font-medium text-accent hover:text-accent-light">
                        View Source →
                      </a>
                      <Button
                        onClick={() => navigate(`/analyze/${repo.name}`)}
                        variant="primary"
                        className="text-xs h-8 px-3 py-1"
                      >
                        Analyze Project
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-text-muted mb-4">No repositories found or not connected to GitHub.</p>
                <Button onClick={() => window.location.href = 'http://localhost:5000/api/auth/github'}>
                  Connect to GitHub
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
