import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  Search,
  BookOpenCheck,
  FileCheck,
  Route,
  Bell,
  ShieldCheck,
  Mic,
  ArrowRight,
  Globe,
  GraduationCap,
  Sprout,
  HeartHandshake,
  Briefcase,
  HeartPulse,
  Home as HomeIcon,
  Users,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Search,
    title: 'Smart Eligibility Matching',
    desc: 'Describe your situation in plain language and see which schemes may fit you.',
  },
  {
    icon: FileCheck,
    title: 'Personalised Document Checklist',
    desc: 'Know exactly what papers to prepare, with a checklist you can tick off.',
  },
  {
    icon: Route,
    title: 'Application Guidance',
    desc: 'Step-by-step guidance from checking eligibility to opening the official portal.',
  },
  {
    icon: Bell,
    title: 'Deadline Tracking',
    desc: 'Never miss an application window with reminders and priority labels.',
  },
];

const CATEGORY_SAMPLES = [
  { icon: GraduationCap, label: 'Education' },
  { icon: Sprout, label: 'Agriculture' },
  { icon: HeartHandshake, label: 'Women & Family' },
  { icon: Briefcase, label: 'Employment' },
  { icon: HeartPulse, label: 'Healthcare' },
  { icon: HomeIcon, label: 'Housing' },
  { icon: Users, label: 'Senior Citizens' },
];

export function Landing({ onLanguage }: { onLanguage: (l: string) => void }) {
  const [lang, setLang] = useState('en');

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-teal-950 text-white overflow-x-hidden">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-glow">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-xl leading-tight">SchemeSaathi AI</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-teal-300 font-semibold">
              Government benefits made simple
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-1.5 py-1.5 border border-white/10">
          <Globe className="w-4 h-4 text-teal-300 ml-2" />
          {['en', 'te', 'hi'].map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                onLanguage(l);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                lang === l ? 'bg-teal-400 text-navy-950' : 'text-white/70 hover:text-white'
              }`}
            >
              {l === 'en' ? 'English' : l === 'te' ? 'తెలుగు' : 'हिंदी'}
            </button>
          ))}
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="chip bg-accent-500/20 text-accent-300 border border-accent-500/30 mb-6">
            <ShieldCheck className="w-3.5 h-3.5" /> For citizens of Telangana, India
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
            Government benefits
            <span className="block bg-gradient-to-r from-teal-300 via-teal-200 to-accent-300 bg-clip-text text-transparent">
              made simple.
            </span>
          </h1>
          <p className="mt-5 text-lg text-navy-100/90 leading-relaxed max-w-md">
            Tell us about your situation. Discover schemes you may qualify for — with document checklists and
            step-by-step application guidance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard" className="btn bg-white text-navy-950 hover:bg-teal-300 hover:-translate-y-0.5 shadow-lift px-7 py-3.5 text-base">
              Discover My Schemes <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/discover"
              className="btn border border-white/25 text-white hover:bg-white/10 px-7 py-3.5 text-base"
            >
              Explore Schemes
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-navy-200">
            <Mic className="w-4 h-4 text-teal-300" />
            Voice-style input supported — speak or type in simple words.
          </div>
        </div>

        <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="absolute -top-8 -left-8 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-lavender-500/20 rounded-full blur-3xl" />
          <div className="relative card !bg-white/5 !border-white/10 backdrop-blur-xl p-8 space-y-4 !shadow-none">
            {[
              { icon: GraduationCap, title: 'Merit Scholarship', tag: 'Education', match: 'Strong match', c: 'from-teal-400 to-teal-600' },
              { icon: HeartPulse, title: 'Family Health Cover', tag: 'Healthcare', match: 'Potential match', c: 'from-accent-400 to-accent-600' },
              { icon: HomeIcon, title: 'Housing Assistance', tag: 'Housing', match: 'Potential match', c: 'from-lavender-400 to-lavender-600' },
            ].map((s, i) => (
              <div
                key={s.title}
                className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 border border-white/10 animate-slide-up hover:bg-white/15 transition-colors"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center shrink-0`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{s.title}</div>
                  <div className="text-xs text-navy-200">{s.tag}</div>
                </div>
                <span className="chip bg-teal-400/20 text-teal-200 border border-teal-400/30 text-[10px]">{s.match}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-xs text-navy-200 pt-2">
              <ShieldCheck className="w-4 h-4 text-teal-300 shrink-0" />
              Scheme details link to official sources. Eligibility is indicative, never guaranteed.
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400/30 to-teal-600/30 border border-teal-400/30 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-teal-300" />
              </div>
              <h3 className="font-bold mb-1.5">{f.title}</h3>
              <p className="text-sm text-navy-200 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-20">
        <h2 className="text-center text-2xl font-bold mb-8">Browse by category</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORY_SAMPLES.map((c) => (
            <Link
              to="/discover"
              key={c.label}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm font-medium hover:bg-teal-400 hover:text-navy-950 hover:border-teal-400 transition-all duration-200"
            >
              <c.icon className="w-4 h-4" /> {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-teal-300 shrink-0" />
          <div>
            <h3 className="font-bold mb-1">Trust & transparency</h3>
            <p className="text-sm text-navy-200 leading-relaxed">
              Scheme information in this prototype references official source labels and shows when each entry was
              last checked. This is a demo with illustrative data — always confirm details on official government
              portals before applying.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-navy-300">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-white">SchemeSaathi AI</span>
          </div>
          <div className="flex flex-wrap gap-5">
            {['About', 'Privacy', 'Help', 'Disclaimer'].map((l) => (
              <Link to="/settings" key={l} className="hover:text-teal-300 transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-center pb-6 text-[11px] text-navy-400">
          Illustrative prototype. Not affiliated with any government body. Never share Aadhaar, OTPs or bank details
          in this app.
        </div>
      </footer>
    </div>
  );
}
