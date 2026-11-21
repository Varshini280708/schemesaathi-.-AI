import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Route, CheckCircle2, Circle, ExternalLink, StickyNote, ChevronLeft } from 'lucide-react';
import { SCHEMES } from '@/data/schemes';
import { useSchemes } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { Notfound } from '@/pages/NotFound';

export function Guide() {
  const { id } = useParams();
  const allSchemes = useSchemes();
  const scheme = allSchemes.find((s) => s.id === id);
  const { getApplication, updateApplication } = useStore();
  const [noteDraft, setNoteDraft] = useState<string | null>(null);

  if (!scheme) return <Notfound />;

  const app = getApplication(scheme.id);
  const steps = scheme.applicationSteps;
  const pct = Math.round((app.completedSteps.length / steps.length) * 100);
  const notes = noteDraft ?? app.notes;

  const toggleStep = (idx: number) => {
    const done = app.completedSteps.includes(idx)
      ? app.completedSteps.filter((i) => i !== idx)
      : [...app.completedSteps, idx].sort((a, b) => a - b);
    const status = done.length === 0 ? 'Not Started' : done.length === steps.length ? 'Applied' : app.status === 'Not Started' ? 'Preparing Documents' : app.status;
    updateApplication(scheme.id, { completedSteps: done, status });
  };

  const saveNotes = () => {
    updateApplication(scheme.id, { notes: notes });
    setNoteDraft(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link to={`/scheme/${scheme.id}`} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-700 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to scheme
      </Link>

      <div className="animate-fade-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 flex items-center gap-3">
          <Route className="w-7 h-7 text-teal-600" /> Application Guide
        </h1>
        <p className="text-slate-500 mt-1">{scheme.name}</p>
      </div>

      <div className="card p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-navy-900">
            Step {Math.min(app.completedSteps.length + 1, steps.length)} of {steps.length}
          </span>
          <span className="chip bg-teal-50 text-teal-700 border border-teal-200">{app.status}</span>
        </div>
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-right text-xs font-semibold text-teal-700 mt-1.5">{pct}% complete</div>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const done = app.completedSteps.includes(i);
          return (
            <div
              key={step}
              className={`card p-5 flex items-start gap-4 transition-all ${done ? 'opacity-75 bg-teal-50/40 border-teal-100' : 'hover:shadow-lift'} animate-fade-up`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <button
                onClick={() => toggleStep(i)}
                className="shrink-0 mt-0.5"
                aria-label={done ? 'Mark step incomplete' : 'Mark step complete'}
              >
                {done ? (
                  <CheckCircle2 className="w-7 h-7 text-teal-600" />
                ) : (
                  <Circle className="w-7 h-7 text-slate-300 hover:text-teal-500 transition-colors" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step {i + 1}</span>
                  {done && <span className="chip bg-teal-100 text-teal-700 text-[10px]">Completed</span>}
                </div>
                <p className={`font-semibold text-navy-900 mt-0.5 ${done ? 'line-through text-slate-500' : ''}`}>{step}</p>
                {i === 2 && (
                  <a href="#" onClick={(e) => e.preventDefault()} className="btn-accent mt-3 text-xs pointer-events-none opacity-80">
                    <ExternalLink className="w-3.5 h-3.5" /> Open official portal (demo)
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-6 animate-fade-up">
        <h2 className="font-bold text-navy-900 flex items-center gap-2 mb-3">
          <StickyNote className="w-5 h-5 text-teal-600" /> Application notes
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNoteDraft(e.target.value)}
          placeholder="Record your reference number, documents submitted, officer contacted…"
          className="input-base min-h-[100px] resize-none"
        />
        <div className="flex items-center gap-3 mt-3">
          <button onClick={saveNotes} className="btn-primary text-xs" disabled={noteDraft === null}>
            Save notes
          </button>
          {noteDraft !== null && <span className="text-xs text-slate-400">Unsaved changes</span>}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Notes save only on this device. This app does not submit applications — you must complete the process on
          the official portal yourself.
        </p>
      </div>
    </div>
  );
}
