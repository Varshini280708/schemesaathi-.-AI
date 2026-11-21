import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  Search,
  GraduationCap,
  Sprout,
  HeartHandshake,
  Briefcase,
  HeartPulse,
  Home as HomeIcon,
  Users,
  Clock,
  Bookmark,
  FileText,
  CalendarClock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES, SCHEMES, UPCOMING_DEADLINES, Category } from '@/data/schemes';
import { useStore } from '@/store/useStore';
import { SchemeCard } from '@/components/SchemeCard';
import { deadlineLabel, formatDate } from '@/lib/date';
import { t } from '@/lib/i18n';

const CAT_ICONS: Record<Category, typeof GraduationCap> = {
  Education: GraduationCap,
  Agriculture: Sprout,
  'Women & Family': HeartHandshake,
  Employment: Briefcase,
  Healthcare: HeartPulse,
  Housing: HomeIcon,
  'Senior Citizens': Users,
};

const EXAMPLE = 'I am a college student in Telangana. My family income is limited. I want to find scholarships.';

export function Dashboard() {
  const { recentlyViewed, savedSchemes, applications, lang, getApplication } = useStore();
  const nav = useNavigate();

  const recent = recentlyViewed.map((id) => SCHEMES.find((s) => s.id === id)!).filter(Boolean);
  const saved = savedSchemes.map((id) => SCHEMES.find((s) => s.id === id)!).filter(Boolean);
  const activeApps = Object.entries(applications);
  const deadlines = UPCOMING_DEADLINES.filter((d) => new Date(d.date) >= new Date()).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="animate-fade-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">{t('welcome', lang)}</h1>
        <p className="text-slate-500 mt-1">{t('discoverSub', lang)}</p>
      </div>

      {/* Search card */}
      <div className="card p-6 sm:p-8 animate-fade-up relative overflow-hidden" style={{ animationDelay: '60ms' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h2 className="font-bold text-lg text-navy-900">Tell us about yourself and what support you're looking for.</h2>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const ta = (e.currentTarget as HTMLFormElement).querySelector('textarea');
              nav('/discover', { state: { query: ta?.value ?? '' } });
            }}
          >
            <textarea
              className="input-base min-h-[110px] resize-none"
              placeholder="Example: I am a college student in Telangana with limited family income, looking for scholarships…"
            />
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button type="submit" className="btn-primary">
                <Search className="w-4 h-4" /> Discover Schemes
              </button>
              <button
                type="button"
                onClick={() => nav('/discover', { state: { query: EXAMPLE } })}
                className="btn-secondary"
              >
                <Mic className="w-4 h-4" /> Try voice input
              </button>
              <span className="text-xs text-slate-400 italic">Demo only — voice is simulated</span>
            </div>
          </form>
        </div>
      </div>

      {/* Quick categories */}
      <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
        <h2 className="font-bold text-lg text-navy-900 mb-3">Quick categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORIES.map((c) => {
            const Icon = CAT_ICONS[c];
            return (
              <Link
                key={c}
                to="/discover"
                state={{ category: c }}
                className="card p-4 flex flex-col items-center gap-2 text-center hover:shadow-lift hover:-translate-y-1 hover:border-teal-200 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-50 to-lavender-50 border border-teal-100 flex items-center justify-center group-hover:from-teal-100 group-hover:to-lavender-100 transition-colors">
                  <Icon className="w-5 h-5 text-teal-600" />
                </div>
                <span className="text-xs font-semibold text-navy-800">{c}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recently viewed */}
        <div className="card p-6 animate-fade-up" style={{ animationDelay: '180ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-navy-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" /> Recently viewed
            </h2>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-400">Schemes you open will appear here.</p>
          ) : (
            <div className="space-y-2">
              {recent.map((s) => (
                <Link
                  key={s.id}
                  to={`/scheme/${s.id}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 transition-all"
                >
                  <div>
                    <div className="text-sm font-semibold text-navy-900">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.category}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Saved schemes */}
        <div className="card p-6 animate-fade-up" style={{ animationDelay: '240ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-navy-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-teal-600" /> Saved schemes
            </h2>
            <Link to="/saved" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
              View all
            </Link>
          </div>
          {saved.length === 0 ? (
            <p className="text-sm text-slate-400">Tap the bookmark on any scheme to save it here.</p>
          ) : (
            <div className="space-y-2">
              {saved.slice(0, 4).map((s) => (
                <Link
                  key={s.id}
                  to={`/scheme/${s.id}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 transition-all"
                >
                  <div>
                    <div className="text-sm font-semibold text-navy-900">{s.name}</div>
                    <div className="text-xs text-slate-400">Deadline: {formatDate(s.deadline)}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Application progress */}
        <div className="card p-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-navy-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" /> Application progress
            </h2>
            <Link to="/applications" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
              View all
            </Link>
          </div>
          {activeApps.length === 0 ? (
            <p className="text-sm text-slate-400">Start an application guide to track progress here.</p>
          ) : (
            <div className="space-y-3">
              {activeApps.slice(0, 3).map(([id, app]) => {
                const scheme = SCHEMES.find((s) => s.id === id);
                if (!scheme) return null;
                const pct = Math.round((app.completedSteps.length / scheme.applicationSteps.length) * 100);
                return (
                  <div key={id} className="p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-navy-900">{scheme.name}</span>
                      <span className="text-slate-500">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming deadlines */}
        <div className="card p-6 animate-fade-up" style={{ animationDelay: '360ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-navy-900 flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-teal-600" /> Upcoming deadlines
            </h2>
            <Link to="/deadlines" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {deadlines.map((d) => {
              const scheme = SCHEMES.find((s) => s.id === d.schemeId);
              if (!scheme) return null;
              const urgent = new Date(d.date).getTime() - Date.now() < 14 * 86400000;
              return (
                <Link
                  key={d.schemeId + d.date}
                  to={`/scheme/${d.schemeId}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 hover:border-accent-200 hover:bg-accent-50/40 transition-all"
                >
                  <div>
                    <div className="text-sm font-semibold text-navy-900">{scheme.name}</div>
                    <div className="text-xs text-slate-400">{d.label}</div>
                  </div>
                  <span className={`chip shrink-0 ${urgent ? 'bg-accent-100 text-accent-700' : 'bg-slate-100 text-slate-600'}`}>
                    {deadlineLabel(d.date)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* All schemes preview */}
      <div className="animate-fade-up" style={{ animationDelay: '420ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-navy-900">Popular schemes</h2>
          <Link to="/discover" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
            See all {SCHEMES.length} schemes
          </Link>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {SCHEMES.slice(0, 3).map((s, i) => (
            <SchemeCard key={s.id} scheme={s} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
