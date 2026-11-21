import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Bookmark,
  ClipboardCheck,
  FileText,
  Bot,
  Settings,
  CalendarClock,
  Landmark,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { t } from '@/lib/i18n';

const ITEMS = [
  { to: '/', icon: Home, key: 'home' },
  { to: '/discover', icon: Search, key: 'discoverSchemes' },
  { to: '/saved', icon: Bookmark, key: 'savedSchemes' },
  { to: '/checklist', icon: ClipboardCheck, key: 'checklist' },
  { to: '/applications', icon: FileText, key: 'myApplications' },
  { to: '/deadlines', icon: CalendarClock, key: 'deadlines' },
  { to: '/assistant', icon: Bot, key: 'assistant' },
  { to: '/settings', icon: Settings, key: 'settings' },
];

export function Sidebar() {
  const { lang } = useStore();
  const location = useLocation();
  return (
    <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white z-40">
      <Link to="/" className="flex items-center gap-3 px-6 py-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-glow">
          <Landmark className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-lg leading-tight">SchemeSaathi</div>
          <div className="text-[10px] uppercase tracking-widest text-teal-300 font-semibold">AI Assistant</div>
        </div>
      </Link>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {ITEMS.map(({ to, icon: Icon, key }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-white/10 text-white shadow-soft border border-white/10'
                  : 'text-navy-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 w-[18px] h-[18px] ${active ? 'text-teal-300' : ''}`} />
              {t(key, lang)}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 text-[11px] text-navy-300 border-t border-white/10">
        Illustrative prototype. Not affiliated with any government body.
      </div>
    </aside>
  );
}

export function BottomNav() {
  const { lang } = useStore();
  const location = useLocation();
  const mobileItems = ITEMS.filter((i) => ['/', '/discover', '/saved', '/applications', '/settings'].includes(i.to));
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 px-2 py-1.5 flex justify-around items-center shadow-soft">
      {mobileItems.map(({ to, icon: Icon, key }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
              active ? 'text-teal-600' : 'text-slate-500'
            }`}
          >
            <Icon className="w-5 h-5" />
            {t(key, lang)}
          </Link>
        );
      })}
    </nav>
  );
}
