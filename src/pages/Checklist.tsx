import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ClipboardCheck,
  Plus,
  RotateCcw,
  Lightbulb,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { SCHEMES } from '@/data/schemes';
import { useSchemes } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { Notfound } from '@/pages/NotFound';

const TIPS = [
  'Keep photocopies and clear scans of every document before starting the application.',
  'Check that names and dates match exactly across all documents.',
  'Certificates like income and residence usually have a validity period — make sure yours is current.',
  'Never share OTPs, passwords or full bank credentials with anyone.',
];

export function Checklist() {
  const allSchemes = useSchemes();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-extrabold text-navy-950 flex items-center gap-3">
          <ClipboardCheck className="w-7 h-7 text-teal-600" /> Document Checklist
        </h1>
        <p className="text-slate-500 mt-1">Choose a scheme to prepare its document list.</p>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {allSchemes.map((s, i) => (
          <Link
            key={s.id}
            to={`/checklist/${s.id}`}
            className="card p-5 flex items-center justify-between gap-3 hover:shadow-lift hover:-translate-y-1 transition-all duration-300 animate-fade-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div>
              <div className="font-bold text-sm text-navy-900">{s.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.requiredDocuments.length} documents</div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ChecklistForScheme() {
  const { id } = useParams();
  const allSchemes = useSchemes();
  const scheme = allSchemes.find((s) => s.id === id);
  const { getChecklist, updateChecklist, resetChecklist } = useStore();
  const [customLabel, setCustomLabel] = useState('');

  if (!scheme) return <Notfound />;

  const list = getChecklist(scheme.id, scheme.requiredDocuments);
  const prepared = list.items.filter((i) => i.status === 'Prepared').length;
  const pct = list.items.length > 0 ? Math.round((prepared / list.items.length) * 100) : 0;

  const toggle = (itemId: string) => {
    updateChecklist(
      scheme.id,
      list.items.map((i) =>
        i.id === itemId ? { ...i, status: i.status === 'Prepared' ? ('Needed' as const) : ('Prepared' as const) } : i
      )
    );
  };

  const addCustom = () => {
    if (!customLabel.trim()) return;
    updateChecklist(scheme.id, [...list.items, { id: `custom-${Date.now()}`, label: customLabel.trim(), status: 'Needed' }]);
    setCustomLabel('');
  };

  const removeItem = (itemId: string) => {
    updateChecklist(scheme.id, list.items.filter((i) => i.id !== itemId));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="animate-fade-up">
        <Link to="/checklist" className="text-sm font-semibold text-slate-500 hover:text-teal-700 transition-colors">
          ← All checklists
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2">{scheme.name}</h1>
        <p className="text-slate-500 mt-1">Tick off documents as you prepare them. Progress saves on this device.</p>
      </div>

      <div className="card p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-navy-900">
            {prepared} of {list.items.length} prepared
          </span>
          <button
            onClick={() => resetChecklist(scheme.id, scheme.requiredDocuments)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-accent-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset checklist
          </button>
        </div>
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-right text-xs font-semibold text-teal-700 mt-1.5">{pct}% ready</div>
      </div>

      <div className="card p-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <h2 className="font-bold text-navy-900 mb-4">Documents for this scheme</h2>
        <div className="space-y-2">
          {list.items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                item.status === 'Prepared' ? 'bg-teal-50/60 border-teal-200' : 'bg-white border-slate-100 hover:border-teal-200'
              }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  item.status === 'Prepared' ? 'bg-teal-600 border-teal-600' : 'border-slate-300 hover:border-teal-500'
                }`}
                aria-label={item.status === 'Prepared' ? 'Mark as needed' : 'Mark as prepared'}
              >
                {item.status === 'Prepared' && (
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-white fill-none stroke-current stroke-[2.5]">
                    <path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${item.status === 'Prepared' ? 'text-teal-800 line-through' : 'text-navy-900'}`}>
                  {item.label}
                </div>
                <div className={`text-[11px] font-semibold ${item.status === 'Prepared' ? 'text-teal-600' : 'text-accent-600'}`}>
                  {item.status === 'Prepared' ? 'Prepared' : 'Needed'}
                </div>
              </div>
              {item.id.startsWith('custom-') && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-slate-400 hover:text-accent-600"
                  aria-label="Remove item"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder="Add your own checklist item…"
            className="input-base flex-1"
          />
          <button onClick={addCustom} className="btn-primary shrink-0" disabled={!customLabel.trim()}>
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="card p-6 bg-gradient-to-r from-lavender-50 to-teal-50 !border-lavender-100 animate-fade-up">
        <h2 className="font-bold text-navy-900 flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-accent-500" /> Preparation tips
        </h2>
        <ul className="space-y-2">
          {TIPS.map((tip) => (
            <li key={tip} className="flex gap-2.5 text-sm text-slate-600">
              <FileText className="w-4 h-4 mt-0.5 shrink-0 text-lavender-500" /> {tip}
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-400 italic mt-4">
          This app never asks you to upload identity documents. Prepare physical or scanned copies yourself and use
          them only on official portals.
        </p>
      </div>
    </div>
  );
}
