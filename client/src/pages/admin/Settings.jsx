import { useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { Shield, Bell, Database, Globe, Mail } from 'lucide-react';

export default function AdminSettings() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || 'Marcus Chen',
    email: user?.email || 'admin@eduverse.com',
    institution: 'EduVerse University',
    timezone: 'Asia/Kolkata',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <Topbar title="Admin Settings" subtitle="System and account configuration" showSearch={false} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Admin Profile */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield size={18} />Admin Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-primary rounded-xl mb-4">
              <Avatar alt={form.name} fallback={form.name.charAt(0)} size="lg" />
              <div>
                <p className="font-semibold text-white">{form.name}</p>
                <p className="text-sm text-blue-200">Super Admin</p>
              </div>
            </div>
            {[
              { label: 'Full Name', key: 'name', icon: Shield },
              { label: 'Email Address', key: 'email', icon: Mail },
              { label: 'Institution Name', key: 'institution', icon: Globe },
              { label: 'Timezone', key: 'timezone', icon: Globe },
            ].map(({ label, key, icon: Icon }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-text mb-1.5 flex items-center gap-1.5">
                  <Icon size={14} className="text-text-muted" />{label}
                </label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
                />
              </div>
            ))}
            <Button onClick={handleSave} className={`w-full ${saved ? 'bg-success text-white' : 'bg-primary text-white'}`}>
              {saved ? '✓ Saved!' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* System Settings */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Database size={18} />System Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Auto-verify student registrations', default: false },
                { label: 'Allow public course enrollment', default: true },
                { label: 'Enable email notifications system-wide', default: true },
                { label: 'Maintenance mode', default: false },
              ].map(opt => (
                <div key={opt.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-text-secondary">{opt.label}</span>
                  <input type="checkbox" defaultChecked={opt.default} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alert Notifications */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Bell size={18} />Admin Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'New user registration alerts', default: true },
                { label: 'System error notifications', default: true },
                { label: 'Daily digest email', default: false },
              ].map(opt => (
                <div key={opt.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-text-secondary">{opt.label}</span>
                  <input type="checkbox" defaultChecked={opt.default} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
