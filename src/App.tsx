import { useEffect } from 'react';
import { Bot } from 'lucide-react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Sidebar, BottomNav } from '@/components/Navigation';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Landing } from '@/pages/Landing';
import { Dashboard } from '@/pages/Dashboard';
import { Discover } from '@/pages/Discover';
import { Saved } from '@/pages/Saved';
import { Checklist, ChecklistForScheme } from '@/pages/Checklist';
import { SchemeDetails } from '@/pages/SchemeDetails';
import { Guide } from '@/pages/Guide';
import { Applications } from '@/pages/Applications';
import { Deadlines } from '@/pages/Deadlines';
import { Settings } from '@/pages/Settings';
import { Notfound } from '@/pages/NotFound';
import { useStore } from '@/store/useStore';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppShell() {
  const { fontSize, highContrast, lang } = useStore();
  return (
    <div
      className={`min-h-screen bg-slate-50 ${highContrast ? 'contrast-more' : ''} ${lang === 'te' ? 'lang-te' : ''}`}
      style={{ fontSize: fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px' }}
    >
      <ScrollToTop />
      <Sidebar />
      <main className="lg:pl-64 pb-20 lg:pb-8">
        <Outlet />
      </main>
      <BottomNav />
      <FloatingAssistant />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing onLanguage={() => {}} />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/checklist/:id" element={<ChecklistForScheme />} />
        <Route path="/scheme/:id" element={<SchemeDetails />} />
        <Route path="/guide/:id" element={<Guide />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/deadlines" element={<Deadlines />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Notfound />} />
      </Route>
    </Routes>
  );
}

function AssistantPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="animate-fade-up text-center py-8">
        <h1 className="text-3xl font-extrabold text-navy-950">AI Assistant</h1>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          The assistant is always with you — tap the round chat button in the bottom corner to ask about schemes,
          documents, eligibility or application steps.
        </p>
      </div>
      <div className="card p-8 text-center animate-fade-up">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-400 to-navy-800 flex items-center justify-center mx-auto mb-5 shadow-glow">
          <Bot className="w-10 h-10 text-white" />
        </div>
        <h2 className="font-bold text-navy-900 mb-2">Your scheme companion</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Ask questions in simple English or Telugu-style phrasing. The assistant gives demo answers based on
          pre-written guidance — it is not official government advice.
        </p>
      </div>
    </div>
  );
}
