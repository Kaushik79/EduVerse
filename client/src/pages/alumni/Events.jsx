import { useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Calendar, MapPin, Users, Clock, Plus, X, Check } from 'lucide-react';

const EVENTS = [
    { id: 1, title: 'EduVerse Annual Alumni Meet 2025', date: new Date(Date.now() + 2592000000).toISOString(), location: 'College Auditorium, Chennai', type: 'meetup', description: 'Join us for the biggest annual gathering of EduVerse alumni. Networking, talks, and dinner.', attendees: 128, maxAttendees: 200, registered: false },
    { id: 2, title: 'Tech Talk: AI in 2025', date: new Date(Date.now() + 864000000).toISOString(), location: 'Virtual (Zoom)', type: 'webinar', description: 'Industry leaders discuss the current state and future of AI. Alumni from Google, Microsoft, and OpenAI.', attendees: 89, maxAttendees: 500, registered: true },
    { id: 3, title: 'Campus Recruitment Drive', date: new Date(Date.now() + 1296000000).toISOString(), location: 'Placement Cell, Campus', type: 'recruitment', description: 'Alumni companies recruiting for 2025 batch. 15 companies participating.', attendees: 45, maxAttendees: 100, registered: false },
    { id: 4, title: 'Startup Pitching Competition', date: new Date(Date.now() + 3888000000).toISOString(), location: 'Innovation Hub', type: 'competition', description: 'Alumni entrepreneurs pitch their startups. Winners receive mentoring and seed funding.', attendees: 32, maxAttendees: 60, registered: false },
];

const TYPE_BADGE = { meetup: 'info', webinar: 'success', recruitment: 'warning', competition: 'danger' };
const TYPE_EMOJI = { meetup: '🎉', webinar: '💻', recruitment: '🎯', competition: '🏆' };

function formatEventDate(d) {
    const date = new Date(d);
    const days = Math.ceil((date - Date.now()) / 86400000);
    return {
        date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        days,
    };
}

function PostEventModal({ onClose, onPost }) {
    const [form, setForm] = useState({ title: '', date: '', location: '', type: 'meetup', description: '', maxAttendees: 100 });
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="font-semibold text-text">Create Event</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-gray-100 cursor-pointer"><X size={16} /></button>
                </div>
                <div className="px-6 py-5 space-y-3">
                    {[{ label: 'Event Title', field: 'title' }, { label: 'Location / Link', field: 'location' }].map(({ label, field }) => (
                        <div key={field}>
                            <label className="block text-xs font-semibold text-text-muted uppercase mb-1">{label}</label>
                            <input value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Date & Time</label>
                            <input type="datetime-local" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Type</label>
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 cursor-pointer">
                                {['meetup', 'webinar', 'recruitment', 'competition'].map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Description</label>
                        <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-1">
                        <button onClick={onClose} className="text-sm text-text-muted hover:text-text cursor-pointer">Cancel</button>
                        <button onClick={() => { onPost({ ...form, id: Date.now(), attendees: 0, registered: false, date: form.date || new Date().toISOString() }); onClose(); }}
                            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light cursor-pointer">
                            <Check size={14} />Create Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AlumniEvents() {
    const [events, setEvents] = useState(EVENTS);
    const [registeredMap, setRegisteredMap] = useState(Object.fromEntries(EVENTS.map(e => [e.id, e.registered])));
    const [showModal, setShowModal] = useState(false);

    const toggleRegister = (id) => {
        setRegisteredMap(m => ({ ...m, [id]: !m[id] }));
        setEvents(prev => prev.map(e => e.id === id ? { ...e, attendees: e.attendees + (registeredMap[id] ? -1 : 1) } : e));
    };

    return (
        <div>
            <Topbar title="Events" subtitle="Alumni meetups, webinars, and opportunities" showSearch={false}
                actions={<button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer"><Plus size={15} />Create Event</button>} />

            <div className="space-y-4">
                {events.map(ev => {
                    const { date, days } = formatEventDate(ev.date);
                    return (
                        <Card key={ev.id} className="hover:shadow-md transition-shadow overflow-hidden">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-blue-50 flex flex-col items-center justify-center shrink-0 text-center border border-blue-100">
                                        <span className="text-2xl">{TYPE_EMOJI[ev.type]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-semibold text-text">{ev.title}</h3>
                                            <Badge variant={TYPE_BADGE[ev.type] || 'default'}>{ev.type}</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-xs text-text-muted mb-2">
                                            <span className="flex items-center gap-1"><Calendar size={12} />{date}</span>
                                            <span className="flex items-center gap-1"><MapPin size={12} />{ev.location}</span>
                                            <span className="flex items-center gap-1"><Users size={12} />{ev.attendees} / {ev.maxAttendees} attending</span>
                                        </div>
                                        <p className="text-sm text-text-secondary mb-3">{ev.description}</p>

                                        {/* Attendance bar */}
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                                            <div className="bg-accent h-1.5 rounded-full" style={{ width: `${(ev.attendees / ev.maxAttendees) * 100}%` }} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Clock size={14} className={days <= 3 ? 'text-danger' : 'text-text-muted'} />
                                                <span className={days <= 3 ? 'text-danger font-semibold' : 'text-text-muted'}>{days} days away</span>
                                            </div>
                                            <button onClick={() => toggleRegister(ev.id)}
                                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${registeredMap[ev.id] ? 'bg-gray-100 text-text-secondary' : 'bg-primary text-white hover:bg-primary-light'}`}>
                                                {registeredMap[ev.id] ? '✓ Registered' : 'Register Now'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {showModal && <PostEventModal onClose={() => setShowModal(false)} onPost={e => setEvents(prev => [e, ...prev])} />}
        </div>
    );
}
