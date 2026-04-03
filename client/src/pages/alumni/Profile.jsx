import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { User, Briefcase, GraduationCap, Link, Link2, GitBranch, Globe, Mail, Phone, Plus, Pencil, Check, Code } from 'lucide-react';

const SKILLS_DB = ['React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Machine Learning', 'Data Science', 'SQL', 'TypeScript', 'Kubernetes', 'Go'];

export default function AlumniProfile() {
    const { user } = useAuth();
    const [editSection, setEditSection] = useState(null);
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.name || 'Jane Smith',
        email: user?.email || 'jane@alumni.eduverse.com',
        phone: user?.phone || '+919876543210',
        bio: 'Software Engineer at Google | EduVerse CS Alumni \'22 | Open source enthusiast.',
        batch: user?.batch || '2018-2022',
        department: user?.department || 'Computer Science',
        degree: 'Bachelor of Technology',
        company: 'Google',
        jobTitle: 'Software Engineer',
        location: 'Bengaluru, India',
        skills: ['React', 'Node.js', 'Python', 'AWS'],
        linkedin: 'https://linkedin.com/in/janesmith',
        github: 'janesmith',
        website: 'https://janesmith.dev',
        leetcode: 'janesmith_dev',
    });

    const [skillInput, setSkillInput] = useState('');

    const addSkill = (skill) => {
        if (!profile.skills.includes(skill)) setProfile(p => ({ ...p, skills: [...p.skills, skill] }));
        setSkillInput('');
    };
    const removeSkill = (s) => setProfile(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

    const handleSave = () => { setSaved(true); setEditSection(null); setTimeout(() => setSaved(false), 2000); };

    const EditBtn = ({ section }) => (
        <button onClick={() => setEditSection(editSection === section ? null : section)}
            className="flex items-center gap-1 text-xs text-accent hover:text-accent-light font-medium transition-colors cursor-pointer">
            {editSection === section ? <Check size={13} /> : <Pencil size={13} />}
            {editSection === section ? 'Done' : 'Edit'}
        </button>
    );

    const InlineField = ({ label, field, type = 'text' }) => (
        <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">{label}</label>
            {editSection ? (
                <input type={type} value={profile[field]} onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
            ) : (
                <p className="text-sm text-text">{profile[field] || <span className="text-text-muted">Not set</span>}</p>
            )}
        </div>
    );

    return (
        <div>
            <Topbar title="My Profile" subtitle="Manage your alumni profile and professional details" showSearch={false} />

            {/* Profile Banner + Header — full width */}
            <div className="rounded-2xl overflow-hidden mb-6 border border-border shadow-sm">
                {/* Banner */}
                <div className="h-36 bg-gradient-to-r from-primary via-blue-600 to-indigo-700 relative">
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')]" />
                </div>

                {/* Profile info row — white background */}
                <div className="bg-white px-6 pt-0 pb-5">
                    <div className="flex items-end gap-4" style={{ marginTop: '-48px' }}>
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg shrink-0">
                            {profile.name.charAt(0).toUpperCase()}
                        </div>
                        {/* Info */}
                        <div className="flex-1 pb-2 pt-12">
                            <h2 className="text-xl font-bold text-text leading-tight">{profile.name}</h2>
                            <p className="text-sm text-text-secondary">{profile.jobTitle} at {profile.company}</p>
                            <p className="text-xs text-text-muted mt-0.5">{profile.department} • Batch {profile.batch} • {profile.location}</p>
                        </div>
                        <div className="pb-2">
                            <button onClick={handleSave}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${saved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary-light'}`}>
                                {saved ? '✓ Saved' : 'Save Profile'}
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-text-secondary mt-3 ml-0">{profile.bio}</p>
                </div>
            </div>

            {/* Two-column layout for details */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Left column: Personal + Education + Job */}
                <div className="xl:col-span-2 space-y-5">
                    {/* Personal Info */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-base"><User size={16} />Personal Information</CardTitle>
                            <EditBtn section="personal" />
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InlineField label="Full Name" field="name" />
                            <InlineField label="Email" field="email" type="email" />
                            <InlineField label="Phone" field="phone" />
                            <InlineField label="Location" field="location" />
                            {editSection === 'personal' && (
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Bio</label>
                                    <textarea rows={3} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition resize-none" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Education */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-base"><GraduationCap size={16} />Education</CardTitle>
                            <EditBtn section="education" />
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InlineField label="Degree" field="degree" />
                            <InlineField label="Department" field="department" />
                            <InlineField label="Batch" field="batch" />
                        </CardContent>
                    </Card>

                    {/* Job / Company */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-base"><Briefcase size={16} />Job / Company</CardTitle>
                            <EditBtn section="job" />
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InlineField label="Company" field="company" />
                            <InlineField label="Job Title" field="jobTitle" />
                        </CardContent>
                    </Card>
                </div>

                {/* Right column: Skills + Social Links */}
                <div className="space-y-5">
                    {/* Skills */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-base"><Code size={16} />Skills</CardTitle>
                            <EditBtn section="skills" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {profile.skills.map(s => (
                                    <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                        {s}
                                        {editSection === 'skills' && (
                                            <button onClick={() => removeSkill(s)} className="ml-0.5 text-blue-400 hover:text-red-500 cursor-pointer leading-none">×</button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {editSection === 'skills' && (
                                <div>
                                    <div className="flex gap-2 mb-2">
                                        <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && skillInput && addSkill(skillInput)}
                                            placeholder="Add a skill…"
                                            className="flex-1 px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                                        <button onClick={() => skillInput && addSkill(skillInput)}
                                            className="px-3 py-2 bg-primary text-white rounded-lg text-sm cursor-pointer hover:bg-primary-light">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {SKILLS_DB.filter(s => !profile.skills.includes(s)).map(s => (
                                            <button key={s} onClick={() => addSkill(s)}
                                                className="px-2 py-1 border border-border rounded-full text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors cursor-pointer">
                                                + {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Social Links */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-base"><Link size={16} />Social Links</CardTitle>
                            <EditBtn section="social" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { icon: Link2, label: 'LinkedIn', field: 'linkedin', color: 'text-blue-600', bg: 'bg-blue-50' },
                                { icon: GitBranch, label: 'GitHub', field: 'github', color: 'text-gray-700', bg: 'bg-gray-100' },
                                { icon: Globe, label: 'Website', field: 'website', color: 'text-green-600', bg: 'bg-green-50' },
                                { icon: Code, label: 'LeetCode', field: 'leetcode', color: 'text-orange-500', bg: 'bg-orange-50' },
                            ].map(({ icon: Icon, label, field, color, bg }) => (
                                <div key={field} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${color} shrink-0`}>
                                        <Icon size={15} />
                                    </div>
                                    {editSection === 'social' ? (
                                        <input value={profile[field]} onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}
                                            placeholder={`${label} URL or username`}
                                            className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                                    ) : profile[field] ? (
                                        <a href={profile[field]?.startsWith('http') ? profile[field] : '#'} target="_blank" rel="noreferrer"
                                            className="flex-1 text-sm text-accent hover:underline truncate">{profile[field]}</a>
                                    ) : (
                                        <span className="text-sm text-text-muted">Not set</span>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick stats */}
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                        <CardContent className="pt-5">
                            <h3 className="text-sm font-semibold text-text mb-3">Network Stats</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[{ label: 'Connections', val: '47' }, { label: 'Referrals', val: '3' }, { label: 'Mentees', val: '8' }].map(s => (
                                    <div key={s.label} className="text-center">
                                        <p className="text-xl font-bold text-accent">{s.val}</p>
                                        <p className="text-[11px] text-text-muted">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
