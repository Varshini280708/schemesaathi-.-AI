import { useState } from 'react';
import {
  Globe,
  Type,
  Contrast,
  Mic,
  Palette,
  ShieldCheck,
  Info,
  Volume2,
} from 'lucide-react';
import { useStore, Lang } from '@/store/useStore';

const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'te', label: 'తెలుగు (Telugu)' },
  { id: 'hi', label: 'हिंदी (Hindi)' },
];

export function Settings() {
  const { lang, setLang, fontSize, setFontSize, theme, setTheme, highContrast, setHighContrast } = useStore();
  const [voiceDemo, setVoiceDemo] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-extrabold text-navy-950">Settings</h1>
        <p className="text-slate-500 mt-1">Personalise your SchemeSaathi experience.</p>
      </div>

      <Section icon={Globe} title="Language">
        <div className="flex flex-wrap gap-2">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                lang === l.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-soft'
                  : 'bg-white text-navy-800 border-slate-200 hover:border-teal-300'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Language affects key navigation labels and the assistant greeting.</p>
      </Section>

      <Section icon={Type} title="Font size">
        <div className="flex gap-2">
          {(['small', 'medium', 'large'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFontSize(f)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${
                fontSize === f
                  ? 'bg-navy-900 text-white border-navy-900'
                  : 'bg-white text-navy-800 border-slate-200 hover:border-navy-300'
              }`}
              style={{ fontSize: f === 'small' ? '0.8rem' : f === 'medium' ? '0.9rem' : '1.05rem' }}
            >
              {f}
            </button>
          ))}
        </div>
      </Section>

      <Section icon={Contrast} title="Accessibility">
        <Toggle
          label="High contrast mode"
          desc="Stronger text contrast and borders for easier reading."
          on={highContrast}
          onChange={setHighContrast}
        />
      </Section>

      <Section icon={Palette} title="Theme">
        <div className="flex gap-2">
          {(['light', 'dark'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${
                theme === t ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-800 border-slate-200 hover:border-navy-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Dark mode is a visual preference for this prototype's chrome; content pages stay light for readability.</p>
      </Section>

      <Section icon={Mic} title="Voice assistance">
        <button
          onClick={() => {
            setVoiceDemo(true);
            setTimeout(() => setVoiceDemo(false), 2000);
          }}
          className="btn-secondary"
        >
          <Volume2 className={`w-4 h-4 ${voiceDemo ? 'animate-pulse-soft text-teal-600' : ''}`} />
          {voiceDemo ? 'Listening… (demo)' : 'Test voice input (demo)'}
        </button>
        <p className="text-xs text-slate-400 mt-2">
          Voice input is simulated in this prototype. No audio is recorded or sent anywhere.
        </p>
      </Section>

      <Section icon={ShieldCheck} title="Privacy information">
        <ul className="space-y-2 text-sm text-slate-600">
          <li>• All your saved schemes, checklists and progress stay on this device only (browser storage).</li>
          <li>• This app never asks for Aadhaar numbers, OTPs, passwords or bank account details.</li>
          <li>• No data is sent to any server. Clearing your browser data removes everything.</li>
          <li>• Always enter sensitive information only on official government portals.</li>
        </ul>
      </Section>

      <Section icon={Info} title="About SchemeSaathi">
        <p className="text-sm text-slate-600 leading-relaxed">
          SchemeSaathi AI is a prototype built to demonstrate how citizens can discover government schemes they may
          qualify for, prepare documents and follow application steps — all in simple language. All scheme data is
          illustrative and is not affiliated with, endorsed by, or verified against any government body.
        </p>
      </Section>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof Globe; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6 animate-fade-up">
      <h2 className="font-bold text-navy-900 flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-teal-600" /> {title}
      </h2>
      {children}
    </div>
  );
}

function Toggle({ label, desc, on, onChange }: { label: string; desc: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="font-semibold text-sm text-navy-900">{label}</div>
        <div className="text-xs text-slate-400">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!on)}
        role="switch"
        aria-checked={on}
        aria-label={label}
        className={`w-12 h-7 rounded-full relative transition-colors shrink-0 ${on ? 'bg-teal-600' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`}
        />
      </button>
    </div>
  );
}
