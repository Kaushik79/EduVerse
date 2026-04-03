import { useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { User, Bell, Shield, Mail, Phone } from 'lucide-react';

export default function TeacherSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || 'Prof. Anderson',
    email: user?.email || 'anderson@eduverse.com',
    department: user?.department || 'Physics Dept.',
    phone: user?.phone || '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <Topbar title="Settings" subtitle="Manage your account and preferences" showSearch={false} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User size={18} />Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-bold">
                {form.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-text">{form.name}</p>
                <p className="text-sm text-text-muted">Teacher • {form.department}</p>
              </div>
            </div>
            {[
              { label: 'Full Name', key: 'name', icon: User },
              { label: 'Email Address', key: 'email', icon: Mail },
              { label: 'Department', key: 'department', icon: Shield },
              { label: 'Phone Number', key: 'phone', icon: Phone },
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
            <Button
              onClick={handleSave}
              className={`w-full mt-2 ${saved ? 'bg-success text-white' : 'bg-primary text-white'}`}
            >
              {saved ? '✓ Saved!' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell size={18} />Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Email notifications for new submissions', default: true },
                { label: 'WhatsApp reminders for deadlines', default: true },
                { label: 'OD request alerts', default: true },
              ].map(pref => (
                <div key={pref.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-text-secondary">{pref.label}</span>
                  <input type="checkbox" defaultChecked={pref.default} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="pt-5">
              <h3 className="font-semibold text-text mb-3">Teaching Stats</h3>
              <div className="grid grid-cols-3 gap-3">
                {[{ label: 'Classes', val: '2' }, { label: 'Students', val: '56' }, { label: 'Assignments', val: '3' }].map(s => (
                  <div key={s.label} className="text-center p-3 bg-white/70 rounded-xl">
                    <p className="text-2xl font-bold text-accent">{s.val}</p>
                    <p className="text-xs text-text-muted">{s.label}</p>
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
