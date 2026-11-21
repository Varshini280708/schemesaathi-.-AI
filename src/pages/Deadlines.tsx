import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Bell, BellOff, AlertTriangle, ChevronRight, ArrowUpDown } from 'lucide-react';
import { SCHEMES, UPCOMING_DEADLINES } from '@/data/schemes';
import { useStore } from '@/store/useStore';
import { daysUntil, formatDate, deadlineLabel } from '@/lib/date';

const PRIORITY_STYLES = {
  high: 'bg-accent-100 text-accent-700',
  medium: 'bg-lavender-100 text-lavender-700',
  low: 'bg-slate-100 text-slate-600',
};

type Sort = 'date' | 'priority';

export function Deadlines() {
  const { getApplication, updateApplication } = useStore();
  const [sort, setSort] = useState<Sort>('date');
  const [mockNotif, setMockNotif] = useState(false);

  const prioRank = { high: 0, medium: 1, low: 2 };

  const items = useMemo(() => {
    const list = [...UPCOMING_DEADLINES];
    if (sort === 'date') list.sort((a, b) => a.date.localeCompare(b.date));
    else list.sort((a, b) => prioRank[a.priority] - prioRank[b.priority]);
    return list;
  }, [sort]);

  const calendar = useMemo(() => {
    const byMonth: Record<string, typeof UPCOMING_DEADLINES> = {};
    for (const d of UPCOMING_DEADLINES) {
      const key = d.date.slice(0, 7);
      (byMonth[key] ??= []).push(d);
    }
    return byMonth;
  }, []);

  const savedIds = UPCOMING_DEADLINES.filter((d) => getApplication(d.schemeId).reminderOn);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-950 flex items-center gap-3">
            <CalendarClock className="w-7 h-7 text-teal-600" /> Deadlines & Reminders
          </h1>
          <p className="text-slate-500 mt-1">Upcoming application windows, sorted by urgency.</p>
        </div>
        <button
          onClick={() => setSort(sort === 'date' ? 'priority' : 'date')}
          className="btn-secondary text-xs"
        >
          <ArrowUpDown className="w-4 h-4" /> Sort: {sort === 'date' ? 'Date' : 'Priority'}
        </button>
      </div>

      {mockNotif && (
        <div className="card p-4 border-teal-200 bg-teal-50 flex items-start gap-3 animate-slide-up">
          <Bell className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="text-sm text-teal-900">
            <strong>Mock notification:</strong> 3 deadlines are within the next 14 days. Prepare documents early to
            avoid last-minute issues. (Demo notification only — no real alerts are sent.)
          </div>
        </div>
      )}

      <div className="card p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-navy-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-600" /> Saved scheme reminders
          </h2>
          <button onClick={() => setMockNotif((v) => !v)} className="btn-secondary text-xs">
            <Bell className="w-3.5 h-3.5" /> {mockNotif ? 'Hide' : 'Show'} mock notification
          </button>
        </div>
        {savedIds.length === 0 ? (
          <p className="text-sm text-slate-400">
            Turn on reminders for a scheme you're tracking — they appear here. (UI only, no real notifications.)
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {savedIds.map((d) => {
              const s = SCHEMES.find((x) => x.id === d.schemeId);
              if (!s) return null;
              return (
                <span key={d.schemeId} className="chip bg-teal-50 text-teal-700 border border-teal-200">
                  <Bell className="w-3.5 h-3.5" /> {s.name} — {formatDate(d.date)}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-bold text-lg text-navy-900 mb-4">Upcoming deadlines</h2>
        <div className="space-y-3">
          {items.map((d, i) => {
            const scheme = SCHEMES.find((s) => s.id === d.schemeId);
            if (!scheme) return null;
            const app = getApplication(d.schemeId);
            const days = daysUntil(d.date);
            const urgent = days <= 14;
            return (
              <div
                key={d.schemeId + d.date}
                className={`card p-5 flex flex-wrap items-center gap-4 transition-all hover:shadow-lift animate-fade-up ${
                  urgent ? 'border-l-4 border-l-accent-400' : ''
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy-900 to-navy-800 text-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-xl font-extrabold leading-none">{new Date(d.date + 'T00:00:00').getDate()}</span>
                  <span className="text-[9px] uppercase tracking-wide text-teal-300">
                    {new Date(d.date + 'T00:00:00').toLocaleString('en', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <Link to={`/scheme/${d.schemeId}`} className="font-bold text-sm text-navy-900 hover:text-teal-700">
                    {scheme.name}
                  </Link>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                    {urgent && <AlertTriangle className="w-3.5 h-3.5 text-accent-500" />}
                    {d.label} — {deadlineLabel(d.date)}
                  </div>
                </div>
                <span className={`chip ${PRIORITY_STYLES[d.priority]}`}>{d.priority} priority</span>
                <button
                  onClick={() => updateApplication(d.schemeId, { reminderOn: !app.reminderOn })}
                  className={`btn text-xs px-3 py-2 ${
                    app.reminderOn ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'btn-secondary'
                  }`}
                >
                  {app.reminderOn ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                  {app.reminderOn ? 'Reminder on' : 'Remind me'}
                </button>
                <Link to={`/scheme/${d.schemeId}`} aria-label="View scheme">
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-lg text-navy-900 mb-4">Deadline calendar</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(calendar).map(([month, ds]) => (
            <div key={month} className="card p-5 animate-fade-up">
              <div className="font-bold text-navy-900 mb-3">
                {new Date(month + '-01T00:00:00').toLocaleString('en', { month: 'long', year: 'numeric' })}
              </div>
              <div className="space-y-2">
                {ds.map((d) => {
                  const scheme = SCHEMES.find((s) => s.id === d.schemeId);
                  if (!scheme) return null;
                  return (
                    <div key={d.schemeId + d.date} className="flex items-center gap-3 text-sm">
                      <span className="w-8 text-center font-bold text-navy-900">
                        {new Date(d.date + 'T00:00:00').getDate()}
                      </span>
                      <span className="flex-1 text-slate-600 truncate">{scheme.name}</span>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${d.priority === 'high' ? 'bg-accent-500' : d.priority === 'medium' ? 'bg-lavender-400' : 'bg-slate-300'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
