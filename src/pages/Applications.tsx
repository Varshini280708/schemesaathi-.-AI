import { Link } from 'react-router-dom';
import { FileText, ArrowRight, CalendarClock } from 'lucide-react';
import { SCHEMES } from '@/data/schemes';
import { useStore, AppStatus } from '@/store/useStore';
import { Notfound } from '@/pages/NotFound';
import { formatDate } from '@/lib/date';

const STATUSES: AppStatus[] = ['Not Started', 'Preparing Documents', 'Ready to Apply', 'Applied'];

const STATUS_STYLES: Record<AppStatus, string> = {
  'Not Started': 'bg-slate-100 text-slate-600',
  'Preparing Documents': 'bg-accent-100 text-accent-700',
  'Ready to Apply': 'bg-lavender-100 text-lavender-700',
  Applied: 'bg-teal-100 text-teal-700',
};

export function Applications() {
  const { applications, updateApplication } = useStore();
  const entries = Object.entries(applications);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-extrabold text-navy-950 flex items-center gap-3">
          <FileText className="w-7 h-7 text-teal-600" /> My Applications
        </h1>
        <p className="text-slate-500 mt-1">Track saved schemes and your application progress.</p>
      </div>

      {entries.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-navy-900 mb-1">No applications tracked yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5">
            Open a scheme and start its application guide — it will appear here with progress tracking.
          </p>
          <Link to="/discover" className="btn-primary">
            Browse schemes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(([id, app], i) => {
            const scheme = SCHEMES.find((s) => s.id === id);
            if (!scheme) return null;
            return <AppRow key={id} schemeId={id} index={i} />;
          })}
        </div>
      )}
    </div>
  );
}

function AppRow({ schemeId, index }: { schemeId: string; index: number }) {
  const { applications, updateApplication, savedSchemes } = useStore();
  const scheme = SCHEMES.find((s) => s.id === schemeId);
  if (!scheme) return <Notfound />;
  const app = applications[schemeId];
  if (!app) return null;
  const pct = Math.round((app.completedSteps.length / scheme.applicationSteps.length) * 100);
  const inSaved = savedSchemes.includes(schemeId);

  return (
    <div className="card p-5 animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-[220px]">
          <Link to={`/scheme/${schemeId}`} className="font-bold text-navy-900 hover:text-teal-700 transition-colors">
            {scheme.name}
          </Link>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <CalendarClock className="w-3.5 h-3.5" /> Deadline {formatDate(scheme.deadline)}
            </span>
            <span>• Added {formatDate(app.addedDate)}</span>
            <span>• {scheme.category}</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden flex-1 max-w-xs">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">{pct}%</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <select
            value={app.status}
            onChange={(e) => updateApplication(schemeId, { status: e.target.value as AppStatus })}
            className={`chip border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 ${STATUS_STYLES[app.status]}`}
            aria-label="Update application status"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <Link to={`/guide/${schemeId}`} className="btn-secondary text-xs">
              Open guide
            </Link>
            <Link to={`/checklist/${schemeId}`} className="btn-secondary text-xs">
              Checklist
            </Link>
          </div>
        </div>
      </div>
      {!inSaved && (
        <div className="mt-3 text-[11px] text-slate-400 italic">Not bookmarked — save it from the scheme page.</div>
      )}
    </div>
  );
}
