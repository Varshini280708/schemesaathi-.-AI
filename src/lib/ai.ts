import { SCHEMES, Scheme, CATEGORIES } from '@/data/schemes';

export interface ChatMsg {
  id: number;
  role: 'user' | 'ai';
  text: string;
  followUps?: string[];
  schemeIds?: string[];
}

const STRONG_KEYWORDS = ['student', 'college', 'scholarship', 'income', 'low income', 'unemployed', 'youth', 'job', 'senior', 'old', 'farmer', 'women entrepreneur', 'business', 'rural'];
const POTENTIAL_KEYWORDS = ['family', 'health', 'housing', 'house', 'women', 'pregnant', 'disabled', 'skill', 'training'];

export function matchSchemes(userText: string): Scheme[] {
  const text = userText.toLowerCase();
  const scored = SCHEMES.map((s) => {
    let score = 0;
    for (const kw of STRONG_KEYWORDS) {
      if (text.includes(kw)) {
        if (s.matchLevel === 'strong') score += 3;
        else if (s.matchLevel === 'potential') score += 1;
      }
    }
    for (const kw of POTENTIAL_KEYWORDS) {
      if (text.includes(kw)) {
        if (s.matchLevel === 'potential') score += 2;
        else if (s.matchLevel === 'strong') score += 1;
      }
    }
    if (text.includes('scholarship') && s.category === 'Education') score += 3;
    if (text.includes('farm') || text.includes('crop') || text.includes('agricultur')) {
      if (s.category === 'Agriculture') score += 4;
    }
    if (text.includes('health') || text.includes('hospital') || text.includes('medic')) {
      if (s.category === 'Healthcare') score += 4;
    }
    if (text.includes('house') || text.includes('home') || text.includes('housing')) {
      if (s.category === 'Housing') score += 4;
    }
    if (text.includes('women') || text.includes('daughter') || text.includes('mother')) {
      if (s.category === 'Women & Family') score += 4;
    }
    if (text.includes('job') || text.includes('employ') || text.includes('work') || text.includes('skill')) {
      if (s.category === 'Employment') score += 4;
    }
    if (text.includes('old') || text.includes('senior') || text.includes('pension') || text.includes('elderly')) {
      if (s.category === 'Senior Citizens') score += 4;
    }
    if (text.includes('student') || text.includes('study') || text.includes('college') || text.includes('school')) {
      if (s.category === 'Education') score += 4;
    }
    if (text.includes('telangana') || text.includes('telangana')) score += 0.5;
    return { s, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((x) => x.score > 0).slice(0, 4).map((x) => x.s);
}

const EXAMPLE_RESPONSE: Record<string, string[]> = {
  en: [
    'Namaste! I am your SchemeSaathi assistant. Tell me about your situation — for example "I am a college student with limited family income" — and I will show schemes that may match.',
  ],
};

export function getGreeting(lang: string): string {
  return EXAMPLE_RESPONSE[lang]?.[0] ?? EXAMPLE_RESPONSE.en[0];
}

export function getAIResponse(userText: string): { text: string; schemeIds: string[]; followUps: string[] } {
  const matches = matchSchemes(userText);

  if (matches.length === 0) {
    return {
      text: "I couldn't find a close match from what you described. Could you tell me a bit more — for example are you a student, a farmer, a working person, or looking for support for a family member?",
      schemeIds: [],
      followUps: [
        'I am a student looking for scholarships',
        'I am a farmer needing crop support',
        'I need health scheme for my family',
        'Show all available schemes',
      ],
    };
  }

  const names = matches.map((s) => `• ${s.name}`).join('\n');
  const top = matches[0];
  const text = `Based on what you shared, here are ${matches.length} scheme(s) that may be relevant:\n\n${names}\n\nThe closest one appears to be "${top.name}". Remember — this is an indicative match only, not an eligibility guarantee. You can check the full details, documents needed and application steps for each one.`;

  return {
    text,
    schemeIds: matches.map((s) => s.id),
    followUps: [
      `What documents do I need for ${top.category} schemes?`,
      'How do I apply for the first scheme?',
      'Are there other schemes I may have missed?',
      'Show deadlines for these schemes',
    ],
  };
}

export function getAssistantReply(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('document') || q.includes('paper') || q.includes('certificate')) {
    return 'For most schemes you will typically need: Aadhaar (keep it safe, never share it in this app), an income certificate, residence proof, a bank passbook copy and a recent photo. Open any specific scheme\u2019s Checklist page to see its exact document list and tick off items as you prepare them.';
  }
  if (q.includes('apply') || q.includes('how do i') || q.includes('process') || q.includes('start')) {
    return 'Applying works in 3 simple steps: (1) Open a scheme and read who can apply, (2) Tick off documents in the Checklist, (3) Follow the step-by-step Application Guide, which ends with a button to open the official portal. This app never submits anything for you — you apply only on the official website.';
  }
  if (q.includes('eligible') || q.includes('qualify')) {
    return 'Eligibility depends on things like your age, income, occupation and where you live. On every scheme page I show a "Potential match" indicator — it means the scheme looks relevant to you, NOT that you are officially eligible. The final decision is always made by the government department handling the scheme.';
  }
  if (q.includes('deadline') || q.includes('last date') || q.includes('close')) {
    return 'Deadlines vary by scheme — many close between December 2026 and February 2027. Open the Deadlines page to see all upcoming dates sorted by urgency, with priority labels. I would suggest preparing documents at least 2 weeks before a deadline.';
  }
  if (q.includes('safe') || q.includes('aadhaar') || q.includes('bank') || q.includes('otp') || q.includes('password')) {
    return 'Good question! This app will NEVER ask for your Aadhaar number, OTP, bank password or full bank details. Anything you save stays only on your own device. Always enter sensitive information only on official government portals, never on third-party sites or apps.';
  }
  if (q.includes('hi') || q.includes('hello') || q.includes('namaste') || q.trim() === '') {
    return 'Namaste! Ask me anything about government schemes — what they offer, who can apply, what documents are needed, or how to start applying. I am here to help you discover benefits you may qualify for.';
  }
  const matches = matchSchemes(question);
  if (matches.length > 0) {
    const top = matches[0];
    return `That sounds like it could relate to "${top.name}". ${top.description} It falls under ${top.category}, and the indicative benefit is: ${top.benefit} Would you like me to show you the full details with documents and steps? Open Discover to see all matching schemes.`;
  }
  return 'I am a demo assistant with pre-written answers, so I may not know everything. Try asking me about scholarships, farmer support, health schemes, pensions, or what documents are generally needed. For confirmed information, always refer to the official government portal linked on each scheme page.';
}

export const SUGGESTED_QUESTIONS = [
  'What schemes can students apply for?',
  'What documents do I generally need?',
  'How do I start applying for a scheme?',
  'Is it safe to share my details here?',
  'Show me upcoming deadlines',
];

export const CATEGORY_ICONS: Record<string, string> = {
  Education: 'GraduationCap',
  Agriculture: 'Sprout',
  'Women & Family': 'HeartHandshake',
  Employment: 'Briefcase',
  Healthcare: 'HeartPulse',
  Housing: 'Home',
  'Senior Citizens': 'Users',
};

export { CATEGORIES };
