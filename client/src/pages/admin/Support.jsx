import { useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { HelpCircle, MessageSquare, Mail, Book, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  { q: 'How do I reset a student\'s password?', a: 'Go to Role Management, find the user, and use the options dropdown to trigger a password reset email.' },
  { q: 'How do I add a new course?', a: 'Navigate to Academic Control > Courses and click "+ New Course" to create a new course.' },
  { q: 'How does the WhatsApp reminder system work?', a: 'The teacher portal allows teachers to broadcast messages to students directly via Twilio WhatsApp. Configure credentials in the server .env file.' },
  { q: 'How do I verify a new user?', a: 'Go to Verification Queue to see all pending users. Click "Verify" to approve or "Reject" to decline their registration.' },
  { q: 'How do I change user roles?', a: 'In Role Management, find the user and use the role dropdown in the "Change Role" column to update their role instantly.' },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors cursor-pointer">
        <span className="font-medium text-text text-sm">{q}</span>
        {open ? <ChevronUp size={16} className="text-text-muted shrink-0" /> : <ChevronDown size={16} className="text-text-muted shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0">
          <p className="text-sm text-text-secondary">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function Support() {
  const [ticket, setTicket] = useState({ subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setTicket({ subject: '', message: '' });
  };

  return (
    <div>
      <Topbar title="Support" subtitle="Help center and ticket system" showSearch={false} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - FAQs */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-base font-semibold text-text flex items-center gap-2 mb-4">
            <Book size={18} className="text-accent" /> Frequently Asked Questions
          </h2>
          {FAQS.map((faq, i) => <FAQ key={i} {...faq} />)}
        </div>

        {/* Right Column - Quick Links + Ticket */}
        <div className="space-y-6">
          {/* Quick contact */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><HelpCircle size={18} />Quick Support</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Mail, label: 'Email Support', sub: 'support@eduverse.com', color: 'bg-blue-50 text-blue-600' },
                { icon: MessageSquare, label: 'Live Chat', sub: 'Available 9am–5pm IST', color: 'bg-green-50 text-green-600' },
              ].map(({ icon: Icon, label, sub, color }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{label}</p>
                    <p className="text-xs text-text-muted">{sub}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ticket Form */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare size={18} />Submit a Ticket</CardTitle></CardHeader>
            <CardContent>
              {submitted ? (
                <div className="flex flex-col items-center py-6 gap-2 text-green-600">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-2xl">✓</div>
                  <p className="font-medium">Ticket submitted!</p>
                  <p className="text-xs text-text-muted">We'll respond within 24 hours</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={ticket.subject}
                      onChange={e => setTicket(t => ({ ...t, subject: e.target.value }))}
                      placeholder="Brief description of issue"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={ticket.message}
                      onChange={e => setTicket(t => ({ ...t, message: e.target.value }))}
                      placeholder="Describe the issue in detail…"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary text-white">Submit Ticket</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
