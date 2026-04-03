import { useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { User, Bell, Link, Briefcase, Mail, Phone, Globe } from 'lucide-react';

export default function AlumniSettings() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || 'Jane Smith',
        email: user?.email || 'jane@alumni.eduverse.com',
        phone: user?.phone || '+919876543210',
        company: 'Google',
        jobTitle: 'Software Engineer',
        linkedin: 'https://linkedin.com/in/janesmith',
        website: 'https://janesmith.dev',
    });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div>
            <Topbar title="Settings" subtitle="Manage your alumni account preferences" showSearch={false} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><User size={18} />Account</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar alt={form.name} fallback={form.name.charAt(0)} size="lg" />
                            <div>
                                <p className="font-semibold text-text">{form.name}</p>
                                <p className="text-sm text-text-muted">Alumni • {form.company}</p>
                            </div>
                        </div>
                        {[
                            { label: 'Full Name', field: 'name', icon: User },
                            { label: 'Email', field: 'email', icon: Mail, type: 'email' },
                            { label: 'Phone', field: 'phone', icon: Phone },
                            { label: 'Company', field: 'company', icon: Briefcase },
                            { label: 'Job Title', field: 'jobTitle', icon: Briefcase },
                            { label: 'LinkedIn', field: 'linkedin', icon: Link },
                            { label: 'Website', field: 'website', icon: Globe },
                        ].map(({ label, field, icon: Icon, type = 'text' }) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-text mb-1.5 flex items-center gap-1.5"><Icon size={14} className="text-text-muted" />{label}</label>
                                <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                            </div>
                        ))}
                        <Button onClick={handleSave} className={`w-full ${saved ? 'bg-success text-white' : 'bg-primary text-white'}`}>
                            {saved ? '✓ Saved!' : 'Save Changes'}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Bell size={18} />Notifications</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {['New job referrals from alumni', 'Event invitations', 'Mentorship request updates', 'New messages'].map(pref => (
                            <div key={pref} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                <span className="text-sm text-text-secondary">{pref}</span>
                                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 cursor-pointer" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
