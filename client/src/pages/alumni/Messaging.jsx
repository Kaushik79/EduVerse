import { useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Search, Send, Users, MessageSquare, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const CONTACTS = [
    { id: 1, name: 'Jane Smith', batch: '2022', company: 'Google', role: 'alumni', lastMsg: 'Hey, let me know if you need a referral!', time: '2m', unread: 1 },
    { id: 2, name: 'Rahul Mehta', batch: '2021', company: 'Amazon', role: 'alumni', lastMsg: 'The interview process at Amazon is pretty straightforward.', time: '1h', unread: 0 },
    { id: 3, name: 'Priya Nair', batch: '2023', company: 'Microsoft', role: 'alumni', lastMsg: 'Happy to guide you on DS/ML roles!', time: '3h', unread: 2 },
    { id: 4, name: 'Vikram Pillai', batch: '2019', company: 'Startup', role: 'alumni', lastMsg: 'Startup life is challenging but rewarding.', time: '1d', unread: 0 },
];

const MOCK_MESSAGES = {
    1: [
        { id: 1, from: 'them', content: 'Hi! I saw your profile on the alumni network.', time: '10:00 AM' },
        { id: 2, from: 'me', content: 'Hey Jane! Yes, I\'d love to connect. I\'m interested in frontend roles at Google.', time: '10:02 AM' },
        { id: 3, from: 'them', content: 'That\'s great! I can refer you. Send me your resume when ready.', time: '10:05 AM' },
        { id: 4, from: 'them', content: 'Hey, let me know if you need a referral!', time: '10:06 AM' },
    ],
    2: [
        { id: 1, from: 'them', content: 'The interview process at Amazon is pretty straightforward.', time: '9:00 AM' },
        { id: 2, from: 'me', content: 'Could you share some tips for the leadership principles?', time: '9:15 AM' },
    ],
};

export default function AlumniMessaging() {
    const { user } = useAuth();
    const [selected, setSelected] = useState(CONTACTS[0]);
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [input, setInput] = useState('');
    const [search, setSearch] = useState('');

    const filtered = CONTACTS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

    const sendMsg = () => {
        if (!input.trim()) return;
        const newMsg = { id: Date.now(), from: 'me', content: input, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
        setMessages(m => ({ ...m, [selected.id]: [...(m[selected.id] || []), newMsg] }));
        setInput('');
    };

    const currentMsgs = messages[selected.id] || [];

    return (
        <div>
            <Topbar title="Messaging" subtitle="Connect with alumni and batchmates" showSearch={false} />

            <div className="flex gap-4 h-[600px]">
                {/* Contacts sidebar */}
                <Card className="w-72 shrink-0 flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-border">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-gray-50 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filtered.map(c => (
                            <button key={c.id} onClick={() => setSelected(c)}
                                className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-border/50 ${selected.id === c.id ? 'bg-blue-50' : ''}`}>
                                <Avatar alt={c.name} fallback={c.name.charAt(0)} size="sm" />
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-text truncate">{c.name}</p>
                                        <span className="text-[10px] text-text-muted shrink-0">{c.time}</span>
                                    </div>
                                    <p className="text-xs text-text-muted truncate">{c.lastMsg}</p>
                                </div>
                                {c.unread > 0 && (
                                    <span className="w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shrink-0">{c.unread}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Chat Area */}
                <Card className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                        <Avatar alt={selected.name} fallback={selected.name.charAt(0)} size="sm" />
                        <div>
                            <p className="font-semibold text-text text-sm">{selected.name}</p>
                            <p className="text-xs text-text-muted">{selected.company} • Batch {selected.batch}</p>
                        </div>
                        <Badge variant="success" className="ml-auto">Online</Badge>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {currentMsgs.map(msg => (
                            <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${msg.from === 'me' ? 'bg-primary text-white rounded-br-sm' : 'bg-gray-100 text-text rounded-bl-sm'}`}>
                                    <p>{msg.content}</p>
                                    <div className={`flex items-center gap-1 mt-0.5 ${msg.from === 'me' ? 'justify-end' : ''}`}>
                                        <span className={`text-[10px] ${msg.from === 'me' ? 'text-blue-200' : 'text-text-muted'}`}>{msg.time}</span>
                                        {msg.from === 'me' && <CheckCheck size={11} className="text-blue-200" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-t border-border">
                        <input type="text" value={input} onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMsg()}
                            placeholder="Type a message…"
                            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-gray-50 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
                        <button onClick={sendMsg}
                            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary-light transition-colors cursor-pointer">
                            <Send size={16} />
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
