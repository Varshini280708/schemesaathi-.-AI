import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, CalendarClock, BadgeCheck, ArrowRight } from 'lucide-react';
import { Scheme } from '@/data/schemes';
import { useStore } from '@/store/useStore';
import { formatDate, deadlineLabel } from '@/lib/date';

const matchStyles = {
  strong: { label: 'Strong potential match', cls: 'bg-teal-50 text-teal-700 border-teal-200' },
  potential: { label: 'Potential match', cls: 'bg-accent-50 text-accent-700 border-accent-200' },
  low: { label: 'Low match — review manually', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export function SchemeCard({ scheme, index = 0 }: { scheme: Scheme; index?: number }) {
  const { savedSchemes, toggleSaved } = useStore();
  const saved = savedSchemes.includes(scheme.id);
  const match = matchStyles[scheme.matchLevel];

  return (
    <div
      className="card p-5 flex flex-col gap-3 hover:shadow-lift hover:-translate-y-1 transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="chip bg-lavender-50 text-lavender-700 border border-lavender-200 mb-2">
            {scheme.category}
          </span>
          <h3 className="font-bold text-navy-900 leading-snug">{scheme.name}</h3>
        </div>
        <button
          onClick={() => toggleSaved(scheme.id)}
          aria-label={saved ? 'Remove from saved' : 'Save scheme'}
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            saved ? 'bg-teal-50 text-teal-600 scale-105' : 'bg-slate-50 text-slate-400 hover:text-teal-600 hover:bg-teal-50'
          }`}
        >
          {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{scheme.description}</p>

      <div className="text-sm">
        <span className="font-semibold text-navy-800">Eligibility: </span>
        <span className="text-slate-600">{scheme.eligibilitySummary}</span>
      </div>

      <div className="text-sm">
        <span className="font-semibold text-navy-800">Benefit: </span>
        <span className="text-slate-600">{scheme.benefit}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`chip border ${match.cls}`}>{match.label}</span>
        <span className="chip bg-slate-50 text-slate-600 border border-slate-200">
          <CalendarClock className="w-3.5 h-3.5" /> {deadlineLabel(scheme.deadline)}
        </span>
        <span className="chip bg-slate-50 text-slate-500 border border-slate-200">
          <BadgeCheck className="w-3.5 h-3.5" /> Verified {formatDate(scheme.lastVerified)}
        </span>
      </div>

      <div className="text-[11px] text-slate-400 italic">Source: {scheme.officialSource} — illustrative data</div>

      <div className="flex gap-2 mt-1">
        <Link to={`/scheme/${scheme.id}`} className="btn-primary flex-1 text-xs">
          View Details <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to={`/scheme/${scheme.id}`} className="btn-secondary text-xs">
          Details
        </Link>
      </div>
    </div>
  );
}
