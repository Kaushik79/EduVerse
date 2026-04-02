import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import { FolderGit2, Users, Plus, ArrowRight, Globe, GitBranch, Rocket, Search } from 'lucide-react';

export default function StudentProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [tab, setTab] = useState('discover');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'personal', techStack: '', maxMembers: 4 });

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data)).catch(() => setProjects(mockProjects));
    api.get('/projects/my').then(r => setMyProjects(r.data)).catch(() => setMyProjects(mockProjects.slice(0, 2)));
  }, []);

  const mockProjects = [
    { id: 1, title: 'AI-Powered Study Planner', description: 'Build an AI assistant that creates personalized study plans.', type: 'hackathon', status: 'recruiting', techStack: '["React","Node.js","OpenAI API","MongoDB"]', maxMembers: 4, owner: { name: 'Alex Morgan', avatar: null }, members: [{ user: { name: 'Alex Morgan' } }, { user: { name: 'Michael Chen' } }] },
    { id: 2, title: 'Smart Campus Navigation', description: 'Indoor navigation using Bluetooth beacons.', type: 'senior_project', status: 'in_progress', techStack: '["React Native","Arduino","BLE","Firebase"]', maxMembers: 3, owner: { name: 'David Kim', avatar: null }, members: [{ user: { name: 'David Kim' } }, { user: { name: 'Emma Watson' } }] },
    { id: 3, title: 'LeetCode Study Group Bot', description: 'Discord bot that assigns daily problems and tracks progress.', type: 'personal', status: 'recruiting', techStack: '["Python","Discord.py","LeetCode API"]', maxMembers: 5, owner: { name: 'Michael Chen', avatar: null }, members: [{ user: { name: 'Michael Chen' } }] },
  ];

  const displayProjects = tab === 'discover' ? projects : myProjects;
  const filtered = displayProjects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const techArr = form.techStack.split(',').map(s => s.trim()).filter(Boolean);
      await api.post('/projects', { ...form, techStack: techArr });
      const r = await api.get('/projects');
      setProjects(r.data);
      setShowCreate(false);
      setForm({ title: '', description: '', type: 'personal', techStack: '', maxMembers: 4 });
    } catch (e) {}
  };

  const handleJoin = async (projectId) => {
    try {
      await api.post(`/projects/${projectId}/join`);
      const r = await api.get('/projects');
      setProjects(r.data);
    } catch (e) {}
  };

  const statusColors = { recruiting: 'success', in_progress: 'warning', completed: 'secondary' };
  const typeLabels = { hackathon: '🏆 Hackathon', academic: '📚 Academic', personal: '🛠 Personal', club: '🎯 Club', senior_project: '🎓 Senior Project' };

  return (
    <div>
      <Topbar title="Projects" subtitle="Find teammates, collaborate, and build amazing things" showSearch={false} />

      {/* Tab + Controls */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['discover', 'my_projects'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer ${tab === t ? 'bg-white shadow-sm text-text' : 'text-text-muted hover:text-text'}`}>
              {t === 'discover' ? '🌐 Discover' : '📂 My Projects'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-56"
            />
          </div>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus size={16} /> New Project
          </Button>
        </div>
      </div>

      {/* Create Form */}
      {showCreate && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Project Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. AI Study Planner" required />
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="personal">Personal</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="academic">Academic</option>
                  <option value="club">Club</option>
                  <option value="senior_project">Senior Project</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" placeholder="What are you building?" />
              </div>
              <Input label="Tech Stack (comma-separated)" value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} placeholder="React, Node.js, Python" />
              <Input label="Max Team Size" type="number" value={form.maxMembers} onChange={e => setForm({ ...form, maxMembers: parseInt(e.target.value) })} />
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button type="submit">Create Project</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((proj) => {
          const tech = typeof proj.techStack === 'string' ? JSON.parse(proj.techStack || '[]') : (proj.techStack || []);
          const members = proj.members || [];
          return (
            <Card key={proj.id} className="hover:shadow-md hover:border-primary/20 transition-all">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                      <FolderGit2 size={18} />
                    </div>
                    <span className="text-xs text-text-muted">{typeLabels[proj.type] || proj.type}</span>
                  </div>
                  <Badge variant={statusColors[proj.status] || 'secondary'}>
                    {proj.status?.replace('_', ' ')}
                  </Badge>
                </div>

                <h3 className="text-base font-semibold text-text mb-1.5">{proj.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-2 mb-3">{proj.description}</p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tech.slice(0, 4).map((t, i) => (
                    <span key={i} className="px-2 py-0.5 text-[11px] bg-gray-100 border border-border rounded-md text-text-secondary">{t}</span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-text-muted" />
                    <span className="text-xs text-text-muted">{members.length} / {proj.maxMembers}</span>
                    <span className="text-xs text-text-muted ml-1">by {proj.owner?.name}</span>
                  </div>
                  {proj.status === 'recruiting' && (
                    <Button variant="ghost" size="sm" onClick={() => handleJoin(proj.id)}>
                      Join <ArrowRight size={14} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Rocket size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text mb-1">No projects found</h3>
          <p className="text-sm text-text-muted">Create your first project or try a different search.</p>
        </div>
      )}
    </div>
  );
}
