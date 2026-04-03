import { useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { User, Bell, Link, Shield, Phone, Mail, BookOpen } from 'lucide-react';

export default function StudentSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex@eduverse.com',
    phone: user?.phone || '+916360299107',
    leetcodeUsername: user?.leetcodeUsername || 'alexmorgan_dev',
    githubUsername: user?.githubUsername || 'alexmorgan',
    linkedinUrl: user?.linkedinUrl || 'https://linkedin.com/in/alexmorgan',
    bio: user?.bio || 'Full-stack developer | Open source enthusiast',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const InfoRow = ({ label, field, icon: Icon, type = 'text' }) => (
    <div>
      <label className="block text-sm font-medium text-text mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-text-muted" />}{label}
      </label>
      {field === 'bio' ? (
        <textarea
          rows={3}
          value={form[field]}
          onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition resize-none"
        />
      ) : (
        <input
          type={type}
          value={form[field]}
          onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
        />
      )}
    </div>
  );

  return (
    <div>
      <Topbar title="Settings" subtitle="Manage your profile and preferences" showSearch={false} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User size={18} />Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar alt={form.name} fallback={form.name.charAt(0)} size="lg" />
              <div>
                <p className="font-semibold text-text">{form.name}</p>
                <p className="text-sm text-text-muted">Student ID: {user?.studentId || '4829'} • {user?.department || 'CS Undergrad'}</p>
              </div>
            </div>
            <InfoRow label="Full Name" field="name" icon={User} />
            <InfoRow label="Email" field="email" icon={Mail} />
            <InfoRow label="Phone" field="phone" icon={Phone} />
            <InfoRow label="Bio" field="bio" />
            <Button onClick={handleSave} className={`w-full ${saved ? 'bg-success text-white' : 'bg-primary text-white'}`}>
              {saved ? '✓ Saved!' : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Link size={18} />Developer Profiles</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <InfoRow label="LeetCode Username" field="leetcodeUsername" icon={BookOpen} />
            <InfoRow label="GitHub Username" field="githubUsername" icon={Shield} />
            <InfoRow label="LinkedIn URL" field="linkedinUrl" icon={Link} />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell size={18} />Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {['Assignment deadline reminders', 'Exam alerts', 'Announcement notifications', 'OD request updates'].map(pref => (
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
