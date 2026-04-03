import { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import api from '../../lib/api';
import { Clock, Plus, Pencil, Trash2, X, Check, AlertCircle } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const DAY_LABELS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri' };
const TYPES = ['lecture', 'lab', 'tutorial', 'other'];
const TYPE_COLORS = {
  lecture: 'bg-blue-100 border-blue-300 text-blue-800',
  lab: 'bg-green-100 border-green-300 text-green-800',
  tutorial: 'bg-amber-100 border-amber-300 text-amber-800',
  other: 'bg-gray-100 border-gray-300 text-gray-800',
};

const EMPTY_FORM = { title: '', day: 'monday', startTime: '09:00', endTime: '10:00', room: '', type: 'lecture' };

// ── Add / Edit Modal ───────────────────────────────────────────────────────────
function ScheduleModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!initial?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        const r = await api.put(`/schedule/${initial.id}`, form);
        onSave(r.data);
      } else {
        const r = await api.post('/schedule', form);
        onSave(r.data);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const F = ({ label, field, type = 'text', opts }) => (
    <div>
      <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">{label}</label>
      {opts ? (
        <select value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition cursor-pointer">
          {opts.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 transition" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text">{isEdit ? 'Edit Schedule' : 'Add New Schedule'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-gray-100 transition-colors cursor-pointer"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              <AlertCircle size={14} />{error}
            </div>
          )}
          <F label="Title / Subject" field="title" />
          <div className="grid grid-cols-2 gap-3">
            <F label="Day" field="day" opts={DAYS.map(d => ({ value: d, label: DAY_LABELS[d] }))} />
            <F label="Type" field="type" opts={TYPES} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Start Time" field="startTime" type="time" />
            <F label="End Time" field="endTime" type="time" />
          </div>
          <F label="Room / Venue" field="room" />
          <div className="flex items-center justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="text-sm text-text-muted hover:text-text transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-60">
              <Check size={15} />{loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────────
function DeleteConfirm({ item, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
          <Trash2 size={22} className="text-danger" />
        </div>
        <h3 className="font-semibold text-text mb-1">Delete Schedule?</h3>
        <p className="text-sm text-text-muted mb-5">Remove <strong>{item.title}</strong> on {DAY_LABELS[item.day]}?</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border border-border text-sm text-text-secondary hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 rounded-lg bg-danger text-white text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Schedule Page ─────────────────────────────────────────────────────────
export default function TeacherSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null); // null=closed, 'new'=add, obj=edit
  const [deleteItem, setDeleteItem] = useState(null);

  const fetchSchedule = async () => {
    try {
      const r = await api.get('/schedule');
      setSchedule(r.data.length ? r.data : MOCK_SCHEDULE);
    } catch {
      setSchedule(MOCK_SCHEDULE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchedule(); }, []);

  const MOCK_SCHEDULE = [
    { id: 1, title: 'Physics 101', day: 'monday', startTime: '09:00', endTime: '10:30', room: 'Room 101', type: 'lecture' },
    { id: 2, title: 'Physics 302', day: 'tuesday', startTime: '11:00', endTime: '12:30', room: 'Room 302', type: 'lecture' },
    { id: 3, title: 'Physics Lab', day: 'wednesday', startTime: '14:00', endTime: '16:00', room: 'Lab 1', type: 'lab' },
    { id: 4, title: 'Office Hours', day: 'thursday', startTime: '10:00', endTime: '12:00', room: 'Office 205', type: 'tutorial' },
  ];

  const handleSave = (saved) => {
    setSchedule(prev => {
      const idx = prev.findIndex(s => s.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [...prev, saved];
    });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/schedule/${deleteItem.id}`);
    } catch { }
    setSchedule(prev => prev.filter(s => s.id !== deleteItem.id));
    setDeleteItem(null);
  };

  const byDay = DAYS.reduce((acc, day) => {
    acc[day] = schedule.filter(s => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});

  return (
    <div>
      <Topbar title="Schedule" subtitle="Manage your weekly teaching timetable" showSearch={false}
        actions={
          <Button variant="default" className="bg-primary text-white" onClick={() => setModalItem('new')}>
            <Plus size={16} />Add Schedule
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-48 text-text-muted">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {DAYS.map(day => (
            <div key={day}>
              {/* Day header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-text uppercase tracking-wider">{DAY_LABELS[day]}</span>
                <button onClick={() => setModalItem({ ...EMPTY_FORM, day })}
                  className="w-5 h-5 rounded flex items-center justify-center text-text-muted hover:text-accent hover:bg-blue-50 transition-colors cursor-pointer">
                  <Plus size={13} />
                </button>
              </div>

              {/* Slots */}
              <div className="space-y-2 min-h-[160px]">
                {byDay[day].length === 0 ? (
                  <button onClick={() => setModalItem({ ...EMPTY_FORM, day })}
                    className="w-full h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-text-muted text-xs hover:border-accent hover:text-accent transition-colors cursor-pointer">
                    + Add
                  </button>
                ) : (
                  byDay[day].map(s => (
                    <div key={s.id}
                      className={`rounded-xl border p-2.5 group relative ${TYPE_COLORS[s.type] || 'bg-gray-100 border-gray-200 text-gray-800'}`}>
                      <p className="font-semibold text-sm leading-tight mb-0.5">{s.title}</p>
                      <div className="flex items-center gap-1 text-xs opacity-80 mb-0.5">
                        <Clock size={10} />{s.startTime}–{s.endTime}
                      </div>
                      <p className="text-[11px] opacity-70">{s.room}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wide opacity-60">{s.type}</span>

                      {/* Edit/Delete buttons (show on hover) */}
                      <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setModalItem(s)}
                          className="w-6 h-6 rounded bg-white/80 flex items-center justify-center text-blue-600 hover:bg-white shadow-sm cursor-pointer">
                          <Pencil size={11} />
                        </button>
                        <button onClick={() => setDeleteItem(s)}
                          className="w-6 h-6 rounded bg-white/80 flex items-center justify-center text-red-500 hover:bg-white shadow-sm cursor-pointer">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalItem !== null && (
        <ScheduleModal
          initial={modalItem === 'new' ? undefined : modalItem}
          onSave={handleSave}
          onClose={() => setModalItem(null)}
        />
      )}
      {deleteItem && <DeleteConfirm item={deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} />}
    </div>
  );
}
