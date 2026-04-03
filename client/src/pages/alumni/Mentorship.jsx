import { useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Search, Star, MessageSquare, Users, Briefcase, GraduationCap, Plus, X, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const MENTORS = [
    { id: 1, name: 'Jane Smith', batch: '2022', company: 'Google', role: 'Software Engineer', expertise: ['Frontend', 'System Design', 'Interviews'], bio: '3+ years at Google. Happy to guide on frontend roles and system design prep.', rating: 4.9, sessions: 47, available: true },
    { id: 2, name: 'Rahul Mehta', batch: '2021', company: 'Amazon', role: 'SDE II', expertise: ['Backend', 'AWS', 'DSA'], bio: 'Experienced in backend systems. Can help with Amazon SDE interview prep and leadership principles.', rating: 4.8, sessions: 63, available: true },
    { id: 3, name: 'Priya Nair', batch: '2023', company: 'Microsoft', role: 'Data Scientist', expertise: ['ML', 'Python', 'Data Science'], bio: 'Specializing in ML and data engineering. Can mentor on AI career paths.', rating: 4.7, sessions: 28, available: false },
    { id: 4, name: 'Vikram Pillai', batch: '2019', company: 'Startup', role: 'CTO & Co-Founder', expertise: ['Startups', 'Product', 'Fundraising'], bio: 'Built 2 startups from scratch. Perfect mentor for entrepreneurship and product thinking.', rating: 4.9, sessions: 82, available: true },
];

function RequestModal({ mentor, onClose, onRequest }) {
    const [form, setForm] = useState({ topic: '', message: '', preferredTime: '' });
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <Avatar alt={mentor.name} fallback={mentor.name.charAt(0)} size="sm" />
                        <div>
                            <h2 className="font-semibold text-text">Request Mentorship</h2>
                            <p className="text-xs text-text-muted">with {mentor.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-gray-100 cursor-pointer"><X size={16} /></button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Topic / Goal</label>
                        <input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="e.g. System Design prep for FAANG"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Message to Mentor</label>
                        <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Introduce yourself and explain what help you're looking for…"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Preferred Time</label>
                        <input type="datetime-local" value={form.preferredTime} onChange={e => setForm(f => ({ ...f, preferredTime: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-1">
                        <button onClick={onClose} className="text-sm text-text-muted hover:text-text cursor-pointer">Cancel</button>
                        <button onClick={() => { onRequest(mentor.id); onClose(); }}
                            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light cursor-pointer">
                            <Check size={15} />Send Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AlumniMentorship() {
    const [search, setSearch] = useState('');
    const [expertiseFilter, setExpertiseFilter] = useState('all');
    const [requestModal, setRequestModal] = useState(null);
    const [requested, setRequested] = useState({});

    const allExpertise = ['all', ...new Set(MENTORS.flatMap(m => m.expertise))];
    const filtered = MENTORS.filter(m => {
        const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()));
        const matchExp = expertiseFilter === 'all' || m.expertise.includes(expertiseFilter);
        return matchSearch && matchExp;
    });

    const handleRequest = (id) => setRequested(r => ({ ...r, [id]: true }));

    return (
        <div>
            <Topbar title="Mentorship" subtitle="Connect with alumni mentors for career guidance" showSearch={false} />

            {/* Become a mentor banner */}
            <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-text">Are you an alumnus? Become a Mentor!</p>
                    <p className="text-xs text-text-secondary mt-0.5">Give back to the community by mentoring current students.</p>
                </div>
                <button className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors cursor-pointer shrink-0">
                    Become a Mentor
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="text" placeholder="Search mentors or topics…" value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {allExpertise.map(e => (
                        <button key={e} onClick={() => setExpertiseFilter(e)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${expertiseFilter === e ? 'bg-accent text-white' : 'bg-white border border-border text-text-secondary hover:border-accent'}`}>
                            {e === 'all' ? 'All Areas' : e}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map(m => (
                    <Card key={m.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-start gap-4 mb-4">
                                <Avatar alt={m.name} fallback={m.name.charAt(0)} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-semibold text-text">{m.name}</h3>
                                        <Badge variant={m.available ? 'success' : 'warning'}>{m.available ? 'Available' : 'Busy'}</Badge>
                                    </div>
                                    <p className="text-sm text-text-secondary">{m.role} at {m.company}</p>
                                    <p className="text-xs text-text-muted">Batch {m.batch}</p>
                                </div>
                            </div>

                            <p className="text-sm text-text-secondary mb-3">{m.bio}</p>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {m.expertise.map(e => (
                                    <span key={e} className="px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full text-xs font-medium">{e}</span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-xs text-text-muted">
                                    <span className="flex items-center gap-1">
                                        <Star size={12} className="text-amber-400 fill-amber-400" />{m.rating}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users size={12} />{m.sessions} sessions
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-text-secondary hover:border-accent hover:text-accent transition-all cursor-pointer">
                                        <MessageSquare size={13} />Chat
                                    </button>
                                    <button
                                        disabled={!m.available || !!requested[m.id]}
                                        onClick={() => m.available && !requested[m.id] && setRequestModal(m)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${requested[m.id] ? 'bg-success text-white' : m.available ? 'bg-primary text-white hover:bg-primary-light' : 'bg-gray-100 text-text-muted cursor-not-allowed'}`}>
                                        {requested[m.id] ? '✓ Requested' : 'Request Session'}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {requestModal && (
                <RequestModal mentor={requestModal} onClose={() => setRequestModal(null)} onRequest={handleRequest} />
            )}
        </div>
    );
}
