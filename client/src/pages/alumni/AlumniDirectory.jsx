import { useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Search, MapPin, Briefcase, GraduationCap, Users, MessageSquare } from 'lucide-react';

const ALUMNI = [
    { id: 1, name: 'Jane Smith', batch: '2018-2022', department: 'CS', company: 'Google', jobTitle: 'Software Engineer', location: 'Bengaluru', skills: ['React', 'Node.js', 'Python'], connected: false },
    { id: 2, name: 'Rahul Mehta', batch: '2017-2021', department: 'CS', company: 'Amazon', jobTitle: 'SDE II', location: 'Hyderabad', skills: ['Java', 'AWS', 'Docker'], connected: true },
    { id: 3, name: 'Priya Nair', batch: '2019-2023', department: 'ECE', company: 'Microsoft', jobTitle: 'Data Scientist', location: 'Pune', skills: ['Python', 'ML', 'SQL'], connected: false },
    { id: 4, name: 'Arjun Sharma', batch: '2016-2020', department: 'Mech', company: 'Tesla', jobTitle: 'Product Manager', location: 'Remote', skills: ['Product', 'Agile', 'SQL'], connected: false },
    { id: 5, name: 'Sneha Kumar', batch: '2018-2022', department: 'CS', company: 'Zomato', jobTitle: 'Frontend Dev', location: 'Bengaluru', skills: ['React', 'TypeScript'], connected: true },
    { id: 6, name: 'Vikram Pillai', batch: '2015-2019', department: 'CS', company: 'Startup', jobTitle: 'CTO & Co-Founder', location: 'Chennai', skills: ['Go', 'Kubernetes', 'AWS'], connected: false },
];

export default function AlumniDirectory() {
    const [search, setSearch] = useState('');
    const [batchFilter, setBatchFilter] = useState('all');
    const [connections, setConnections] = useState(
        Object.fromEntries(ALUMNI.map(a => [a.id, a.connected]))
    );

    const batches = ['all', ...new Set(ALUMNI.map(a => a.batch))];

    const filtered = ALUMNI.filter(a => {
        const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase()) || a.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
        const matchBatch = batchFilter === 'all' || a.batch === batchFilter;
        return matchSearch && matchBatch;
    });

    const toggle = (id) => setConnections(c => ({ ...c, [id]: !c[id] }));

    return (
        <div>
            <Topbar title="Alumni Directory" subtitle={`${ALUMNI.length} alumni in the network`} showSearch={false} />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="text" placeholder="Search by name, company, or skill…" value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {batches.map(b => (
                        <button key={b} onClick={() => setBatchFilter(b)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${batchFilter === b ? 'bg-accent text-white' : 'bg-white border border-border text-text-secondary hover:border-accent'}`}>
                            {b === 'all' ? 'All Batches' : b}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(a => (
                    <Card key={a.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-start gap-3 mb-3">
                                <Avatar alt={a.name} fallback={a.name.charAt(0)} />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-text text-sm">{a.name}</h3>
                                    <p className="text-xs text-text-secondary">{a.jobTitle}</p>
                                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                                        <Briefcase size={11} />{a.company}
                                    </p>
                                </div>
                                <Badge variant="info">{a.batch}</Badge>
                            </div>

                            <div className="flex items-center gap-3 mb-3 text-xs text-text-muted">
                                <span className="flex items-center gap-1"><GraduationCap size={12} />{a.department}</span>
                                <span className="flex items-center gap-1"><MapPin size={12} />{a.location}</span>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {a.skills.slice(0, 4).map(s => (
                                    <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-medium">{s}</span>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => toggle(a.id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${connections[a.id] ? 'bg-gray-100 text-text-secondary' : 'bg-primary text-white hover:bg-primary-light'}`}>
                                    <Users size={14} />{connections[a.id] ? 'Connected' : 'Connect'}
                                </button>
                                <button className="flex items-center justify-center gap-1.5 px-3 py-2 border border-border rounded-lg text-sm text-text-secondary hover:border-accent hover:text-accent transition-all cursor-pointer">
                                    <MessageSquare size={14} />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-text-muted gap-2">
                    <Users size={32} />
                    <p>No alumni found matching your search</p>
                </div>
            )}
        </div>
    );
}
