import { useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Search, MapPin, Briefcase, ExternalLink, Bookmark, BookmarkCheck, Plus, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const JOBS = [
    { id: 1, title: 'Senior Frontend Developer', company: 'Google', location: 'Bengaluru (Hybrid)', type: 'Full-time', postedBy: 'Jane Smith', batch: '2022', skills: ['React', 'TypeScript', 'GraphQL'], description: 'Join the Google team to build next-gen web experiences. 3+ years experience required.', salary: '₹25-40 LPA', referral: true },
    { id: 2, title: 'Data Engineer', company: 'Amazon', location: 'Hyderabad', type: 'Full-time', postedBy: 'Rahul Mehta', batch: '2021', skills: ['Python', 'Spark', 'AWS'], description: 'Work on large-scale data pipelines powering Amazon\'s analytics platform.', salary: '₹18-30 LPA', referral: true },
    { id: 3, title: 'ML Intern', company: 'Microsoft', location: 'Remote', type: 'Internship', postedBy: 'Priya Nair', batch: '2023', skills: ['Python', 'TensorFlow', 'SQL'], description: '6-month internship in AI/ML research. Open to pre-final year students.', salary: '₹60K/month', referral: true },
    { id: 4, title: 'Product Manager', company: 'Flipkart', location: 'Bengaluru', type: 'Full-time', postedBy: 'Arjun Sharma', batch: '2020', skills: ['Product', 'Analytics', 'SQL'], description: 'Drive product strategy for Flipkart\'s supply chain tech.', salary: '₹22-35 LPA', referral: false },
];

const TYPE_BADGE = { 'Full-time': 'success', 'Internship': 'info', 'Contract': 'warning' };

function PostJobModal({ onClose, onPost }) {
    const [form, setForm] = useState({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', skills: '' });
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="font-semibold text-text">Post a Job / Referral</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-gray-100 cursor-pointer"><X size={16} /></button>
                </div>
                <div className="px-6 py-5 space-y-3">
                    {[
                        { label: 'Job Title', field: 'title' }, { label: 'Company', field: 'company' },
                        { label: 'Location', field: 'location' }, { label: 'Salary Range', field: 'salary' },
                    ].map(({ label, field }) => (
                        <div key={field}>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">{label}</label>
                            <input value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Type</label>
                        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition cursor-pointer">
                            {['Full-time', 'Internship', 'Contract'].map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Skills (comma separated)</label>
                        <input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="React, Python, SQL"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Description</label>
                        <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition resize-none" />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-1">
                        <button onClick={onClose} className="text-sm text-text-muted hover:text-text cursor-pointer">Cancel</button>
                        <button onClick={() => { onPost({ ...form, id: Date.now(), skills: form.skills.split(',').map(s => s.trim()), referral: true, postedBy: 'You', batch: '2022' }); onClose(); }}
                            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light cursor-pointer">
                            <Plus size={15} />Post Job
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AlumniJobs() {
    const [jobs, setJobs] = useState(JOBS);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [saved, setSaved] = useState({});
    const [showModal, setShowModal] = useState(false);

    const filtered = jobs.filter(j => {
        const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'all' || j.type === typeFilter;
        return matchSearch && matchType;
    });

    const toggleSave = (id) => setSaved(s => ({ ...s, [id]: !s[id] }));

    return (
        <div>
            <Topbar title="Jobs & Referrals" subtitle="Opportunities shared by alumni" showSearch={false}
                actions={<button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer"><Plus size={15} />Post Job</button>} />

            {/* Alumni Referral Banner */}
            <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-start gap-3">
                <AlertCircle size={18} className="text-accent mt-0.5 shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-text">Alumni Referral Network</p>
                    <p className="text-xs text-text-secondary">Jobs with <span className="font-semibold text-accent">Referral Available</span> mean an alumnus can refer you directly. Reach out via Messaging!</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="text" placeholder="Search jobs or companies…" value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                </div>
                {['all', 'Full-time', 'Internship', 'Contract'].map(t => (
                    <button key={t} onClick={() => setTypeFilter(t)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${typeFilter === t ? 'bg-accent text-white' : 'bg-white border border-border text-text-secondary hover:border-accent'}`}>
                        {t === 'all' ? 'All Types' : t}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filtered.map(job => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h3 className="font-semibold text-text">{job.title}</h3>
                                        <Badge variant={TYPE_BADGE[job.type] || 'default'}>{job.type}</Badge>
                                        {job.referral && <Badge variant="info">✨ Referral Available</Badge>}
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-xs text-text-muted mb-2">
                                        <span className="flex items-center gap-1"><Briefcase size={11} />{job.company}</span>
                                        <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                                        <span className="font-medium text-text-secondary">{job.salary}</span>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-3">{job.description}</p>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {(job.skills || []).map(s => (
                                            <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-medium">{s}</span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-text-muted">Posted by <span className="font-medium text-text">{job.postedBy}</span> • Batch {job.batch}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <button onClick={() => toggleSave(job.id)}
                                        className={`transition-colors cursor-pointer ${saved[job.id] ? 'text-accent' : 'text-text-muted hover:text-accent'}`}>
                                        {saved[job.id] ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                                    </button>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-light transition-colors cursor-pointer">
                                        Apply <ExternalLink size={11} />
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {showModal && <PostJobModal onClose={() => setShowModal(false)} onPost={j => setJobs(prev => [j, ...prev])} />}
        </div>
    );
}
