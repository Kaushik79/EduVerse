import { useState } from 'react';
import axios from 'axios';
import { X, Send, Users, Layers, Hash, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const FILTER_OPTIONS = [
    { value: 'all', label: 'All Students', icon: Users },
    { value: 'section', label: 'By Section', icon: Layers },
    { value: 'batch', label: 'By Batch / Year', icon: Hash },
];

const MESSAGE_TEMPLATES = [
    { label: 'Assignment Reminder', text: 'Hi {name}, this is a reminder that an assignment is due soon. Please submit on time.' },
    { label: 'Exam Alert', text: 'Hi {name}, your upcoming exam is scheduled. Make sure you are prepared and reach the venue on time.' },
    { label: 'General Notice', text: 'Dear {name}, please check the EduVerse portal for an important update from your teacher.' },
];

export default function MessagingModal({ onClose }) {
    const [filter, setFilter] = useState('all');
    const [filterValue, setFilterValue] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
    const [result, setResult] = useState(null);

    const characterLimit = 1000;

    async function handleSend() {
        if (!message.trim()) return;
        if ((filter === 'section' || filter === 'batch') && !filterValue.trim()) return;

        setStatus('loading');
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${API_BASE}/whatsapp/send-reminder`,
                { filter, value: filterValue.trim() || undefined, message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResult(data);
            setStatus('success');
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Something went wrong.';
            setResult({ error: errMsg });
            setStatus('error');
        }
    }

    function handleReset() {
        setStatus(null);
        setResult(null);
        setMessage('');
        setFilter('all');
        setFilterValue('');
    }

    return (
        /* ---- Backdrop ---- */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* ---- Panel ---- */}
            <div
                className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg relative flex flex-col overflow-hidden"
                style={{ maxHeight: '90vh' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                            <Send size={16} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-text">Send WhatsApp Message</h2>
                            <p className="text-xs text-text-muted">Broadcast to targeted students</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-hover hover:text-text transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                    {/* ---- Success / Error result ---- */}
                    {status === 'success' && result && (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-3">
                            <div className="flex items-center gap-2 text-green-700 font-semibold">
                                <CheckCircle size={18} />
                                Messages dispatched!
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center text-sm">
                                {[
                                    { label: 'Total', value: result.totalStudents },
                                    { label: 'Sent', value: result.sent + result.simulated },
                                    { label: 'Skipped', value: result.skipped },
                                    { label: 'Failed', value: result.failed },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-white rounded-lg py-2 border border-green-100">
                                        <p className="text-lg font-bold text-green-800">{value}</p>
                                        <p className="text-xs text-green-600">{label}</p>
                                    </div>
                                ))}
                            </div>
                            {result.simulated > 0 && (
                                <p className="text-xs text-green-600 text-center">
                                    ℹ️ {result.simulated} message(s) simulated — add Twilio credentials to send live.
                                </p>
                            )}
                            <button
                                onClick={handleReset}
                                className="w-full text-sm text-green-700 underline underline-offset-2 cursor-pointer"
                            >
                                Send another message
                            </button>
                        </div>
                    )}

                    {status === 'error' && result && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                            <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-red-700">{result.error}</p>
                                <button onClick={handleReset} className="text-xs text-red-500 underline mt-1 cursor-pointer">
                                    Try again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ---- Form (hidden once result shown) ---- */}
                    {!status && (
                        <>
                            {/* Step 1 — Recipient Filter */}
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">
                                    1. Choose Recipients
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {FILTER_OPTIONS.map(({ value, label, icon: Icon }) => (
                                        <button
                                            key={value}
                                            onClick={() => { setFilter(value); setFilterValue(''); }}
                                            className={[
                                                'flex flex-col items-center gap-1.5 rounded-xl border py-3 px-2 text-xs font-medium transition-all cursor-pointer',
                                                filter === value
                                                    ? 'border-green-500 bg-green-50 text-green-700'
                                                    : 'border-border bg-surface text-text-secondary hover:border-green-300',
                                            ].join(' ')}
                                        >
                                            <Icon size={18} />
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {(filter === 'section' || filter === 'batch') && (
                                    <input
                                        type="text"
                                        placeholder={filter === 'section' ? 'e.g.  A, B, C …' : 'e.g.  2022, 2023 …'}
                                        value={filterValue}
                                        onChange={(e) => setFilterValue(e.target.value)}
                                        className="mt-3 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                    />
                                )}
                            </div>

                            {/* Step 2 — Templates */}
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">
                                    2. Quick Templates <span className="text-text-muted font-normal">(optional)</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {MESSAGE_TEMPLATES.map((tpl) => (
                                        <button
                                            key={tpl.label}
                                            onClick={() => setMessage(tpl.text)}
                                            className="text-xs bg-surface border border-border hover:border-green-400 hover:text-green-700 rounded-full px-3 py-1 transition-colors cursor-pointer"
                                        >
                                            {tpl.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Step 3 — Message body */}
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">
                                    3. Message
                                    <span className="text-text-muted font-normal ml-1">
                                        — use <code className="bg-surface-hover rounded px-1">{'{name}'}</code> for personalisation
                                    </span>
                                </label>
                                <textarea
                                    rows={5}
                                    maxLength={characterLimit}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Hi {name}, this is a reminder from your teacher…"
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
                                />
                                <p className="text-right text-xs text-text-muted mt-1">
                                    {message.length}/{characterLimit}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                {!status && (
                    <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
                        <button
                            onClick={onClose}
                            className="text-sm text-text-muted hover:text-text transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={
                                !message.trim() ||
                                ((filter === 'section' || filter === 'batch') && !filterValue.trim())
                            }
                            className={[
                                'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer',
                                message.trim()
                                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                                    : 'bg-surface border border-border text-text-muted cursor-not-allowed',
                            ].join(' ')}
                        >
                            <Send size={15} />
                            Send Message
                        </button>
                    </div>
                )}

                {/* Loading overlay */}
                {status === 'loading' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm rounded-2xl gap-3">
                        <Loader size={32} className="animate-spin text-green-500" />
                        <p className="text-sm text-text-muted">Sending messages…</p>
                    </div>
                )}
            </div>
        </div>
    );
}
