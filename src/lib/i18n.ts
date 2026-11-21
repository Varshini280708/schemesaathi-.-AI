export type Lang = 'en' | 'te' | 'hi';

type Dict = Record<string, { en: string; te: string; hi: string }>;

const D: Dict = {
  welcome: {
    en: 'Welcome to SchemeSaathi',
    te: 'స్కీమ్‌సాథీకి స్వాగతం',
    hi: 'स्कीमसाथी में आपका स्वागत है',
  },
  discoverSub: {
    en: "Let's discover benefits that may be available to you.",
    te: 'మీకు అందుబాటులో ఉండే సదుపాయాలను కనుగొనండి.',
    hi: 'आपके लिए उपलब्ध लाभों की खोज करें।',
  },
  discoverSchemes: {
    en: 'Discover Schemes',
    te: 'పథకాలను కనుగొనండి',
    hi: 'योजनाएँ खोजें',
  },
  savedSchemes: {
    en: 'Saved Schemes',
    te: 'సేవ్ చేసిన పథకాలు',
    hi: 'सहेजी गई योजनाएँ',
  },
  myApplications: {
    en: 'My Applications',
    te: 'నా అప్లికేషన్లు',
    hi: 'मेरे आवेदन',
  },
  checklist: { en: 'Checklist', te: 'చెక్‌లిస్ట్', hi: 'चेकलिस्ट' },
  settings: { en: 'Settings', te: 'సెట్టింగ్స్', hi: 'सेटिंग्स' },
  home: { en: 'Home', te: 'హోమ్', hi: 'होम' },
  deadlines: { en: 'Deadlines', te: 'గడువులు', hi: 'समय-सीमाएँ' },
};

export function t(key: string, lang: Lang): string {
  const entry = D[key];
  if (!entry) return key;
  return entry[lang];
}
