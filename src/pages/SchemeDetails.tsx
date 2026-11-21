import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  BookmarkCheck,
  CalendarClock,
  BadgeCheck,
  Landmark,
  AlertTriangle,
  FileText,
  Route,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ArrowRight,
} from 'lucide-react';
import { SCHEMES } from '@/data/schemes';
import { useSchemes } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { formatDate, deadlineLabel } from '@/lib/date';
import { Notfound } from '@/pages/NotFound';

export function SchemeDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const allSchemes = useSchemes();
  const scheme = allSchemes.find((s) => s.id === id);
  const { savedSchemes, toggleSaved, addRecent, getApplication } = useStore();

  useEffect(() => {
    if (scheme) addRecent(scheme.id);
  }, [scheme, addRecent]);

  if (!scheme) return <Notfound />;

  const saved = savedSchemes.includes(scheme.id);
  const app = getApplication(scheme.id);
  const pct = Math.round((app.completedSteps.length / scheme.applicationSteps.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <button
        onClick={() => nav(-1)}
        className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-700 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="card p-6 sm:p-8 animate-fade-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="chip bg-lavender-50 text-lavender-700 border border-lavender-200 mb-3">{scheme.category}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 leading-tight">{scheme.name}</h1>
            <p className="text-slate-500 mt-2">{scheme.description}</p>
          </div>
          <button
            onClick={() => toggleSaved(scheme.id)}
            className={`btn shrink-0 ${saved ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'btn-secondary'}`}
          >
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {saved ? 'Saved' : 'Save scheme'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="chip bg-teal-50 text-teal-700 border border-teal-200">
            <CalendarClock className="w-3.5 h-3.5" /> {deadlineLabel(scheme.deadline)} — {formatDate(scheme.deadline)}
          </span>
          <span className="chip bg-slate-50 text-slate-600 border border-slate-200">
            <BadgeCheck className="w-3.5 h-3.5" /> Last verified: {formatDate(scheme.lastVerified)}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Section title="Who can apply" icon={CheckCircle2} items={scheme.whoCanApply} tone="teal" />
        <Section title="Eligibility requirements" icon={FileText} items={scheme.eligibilityRequirements} tone="navy" />
      </div>

      <div className="card p-6 border-l-4 border-l-accent-400 animate-fade-up">
        <h2 className="font-bold text-navy-900 flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-accent-500" /> Conditions that may need further verification
        </h2>
        <ul className="space-y-2">
          {scheme.conditionsToVerify.map((c) => (
            <li key={c} className="flex gap-2.5 text-sm text-slate-600">
              <Circle className="w-2 h-2 mt-1.5 shrink-0 fill-accent-400 text-accent-400" /> {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 animate-fade-up">
          <h2 className="font-bold text-navy-900 mb-4">Benefits</h2>
          <ul className="space-y-2.5">
            {scheme.benefitsList.map((b) => (
              <li key={b} className="flex gap-2.5 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-teal-600" /> {b}
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3.5 rounded-xl bg-teal-50 border border-teal-100 text-sm font-semibold text-teal-800">
            {scheme.benefit}
          </div>
        </div>

        <div className="card p-6 animate-fade-up">
          <h2 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" /> Required documents
          </h2>
          <ul className="space-y-2.5">
            {scheme.requiredDocuments.map((d) => (
              <li key={d} className="flex gap-2.5 text-sm text-slate-600">
                <Circle className="w-2 h-2 mt-1.5 shrink-0 fill-lavender-400 text-lavender-400" /> {d}
              </li>
            ))}
          </ul>
          <Link to={`/checklist/${scheme.id}`} className="btn-secondary w-full mt-4 text-xs">
            Open interactive checklist <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="card p-6 animate-fade-up">
        <h2 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Route className="w-5 h-5 text-teal-600" /> Application process
        </h2>
        <ol className="space-y-3">
          {scheme.applicationSteps.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-slate-600 pt-1">{step}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link to={`/guide/${scheme.id}`} className="btn-primary">
            Start application guide <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to={`/checklist/${scheme.id}`} className="btn-secondary">
            Prepare documents
          </Link>
        </div>
      </div>

      <div className="card p-6 animate-fade-up">
        <h2 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-teal-600" /> Important dates
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {scheme.importantDates.map((d) => (
            <div key={d.label} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{d.label}</div>
              <div className="font-bold text-navy-900 mt-1">{formatDate(d.date)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 bg-gradient-to-r from-navy-950 to-navy-900 !border-navy-900 text-white animate-fade-up">
        <div className="flex items-start gap-4">
          <Landmark className="w-8 h-8 text-teal-300 shrink-0" />
          <div className="flex-1">
            <h2 className="font-bold mb-1">Official source</h2>
            <p className="text-sm text-navy-200">
              {scheme.officialSource} — illustrative reference for this prototype. Always confirm details on the
              actual official portal before applying.
            </p>
            <p className="text-xs text-navy-300 mt-2">Last verification date: {formatDate(scheme.lastVerified)}</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-accent-50 border border-accent-200 text-sm text-accent-800 animate-fade-up">
        <strong>Disclaimer:</strong> Eligibility is indicative. Final approval is determined by the relevant
        government authority. This page shows illustrative sample data only.
      </div>

      {app.completedSteps.length > 0 && (
        <div className="card p-4 animate-fade-in">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-navy-900">Your guide progress: {app.status}</span>
            <span className="text-slate-500">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  items,
  tone,
}: {
  title: string;
  icon: typeof CheckCircle2;
  items: string[];
  tone: 'teal' | 'navy';
}) {
  return (
    <div className="card p-6 animate-fade-up">
      <h2 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
        <Icon className={`w-5 h-5 ${tone === 'teal' ? 'text-teal-600' : 'text-navy-700'}`} /> {title}
      </h2>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex gap-2.5 text-sm text-slate-600">
            <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${tone === 'teal' ? 'text-teal-600' : 'text-navy-500'}`} /> {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
