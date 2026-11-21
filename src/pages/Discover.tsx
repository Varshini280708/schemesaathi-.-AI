import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Mic, Bot, User, Trash2, SlidersHorizontal, Search } from 'lucide-react';
import { SCHEMES, CATEGORIES, Scheme, Category } from '@/data/schemes';
import { ChatMsg, getAIResponse, getGreeting } from '@/lib/ai';
import { SchemeCard } from '@/components/SchemeCard';
import { useStore } from '@/store/useStore';

const EXAMPLE = 'I am a college student studying in Telangana. My family income is limited. I want to find scholarships.';

type DeadlineFilter = 'all' | '7' | '30' | '90';

export function Discover() {
  const location = useLocation();
  const initialQuery = (location.state as { query?: string; category?: Category } | null)?.query ?? '';
  const initialCategory = (location.state as { query?: string; category?: Category } | null)?.category;

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState(initialQuery);
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState<Category | 'All'>(initialCategory ?? 'All');
  const [deadline, setDeadline] = useState<DeadlineFilter>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'deadline' | 'name'>('relevance');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { lang } = useStore();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ id: 1, role: 'ai', text: getGreeting(lang), followUps: ['I am a student looking for scholarships', 'I am a farmer needing crop support'] }]);
    }
  }, [messages.length, lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim() || typing) return;
    setMessages((m) => [...m, { id: Date.now(), role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const res = getAIResponse(text);
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'ai', text: res.text, followUps: res.followUps, schemeIds: res.schemeIds }]);
      setTyping(false);
    }, 1400);
  };

  // Determine if a search has been performed (either chat or filters)
  const hasSearched = messages.length > 1 || category !== 'All' || searchText.trim() !== '' || deadline !== 'all';

  const matchedIds = new Set(messages.flatMap((m) => m.schemeIds ?? []));
  const now = Date.now();
  let results: Scheme[] = SCHEMES;
  if (matchedIds.size > 0) {
    const ranked = [...matchedIds]
      .map((id) => SCHEMES.find((s) => s.id === id)!)
      .filter(Boolean);
    results = [...ranked, ...SCHEMES.filter((s) => !matchedIds.has(s.id))];
  }
  if (category !== 'All') results = results.filter((s) => s.category === category);
  if (deadline !== 'all') {
    const days = parseInt(deadline);
    results = results.filter((s) => {
      const diff = (new Date(s.deadline + 'T00:00:00').getTime() - now) / 86400000;
      return diff <= days;
    });
  }
  if (searchText.trim()) {
    const q = searchText.toLowerCase();
    results = results.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
  }
  if (sortBy === 'deadline') results = [...results].sort((a, b) => a.deadline.localeCompare(b.deadline));
  if (sortBy === 'name') results = [...results].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-extrabold text-navy-950">AI Scheme Discovery</h1>
        <p className="text-slate-500 mt-1">
          Describe your situation in simple words. Demo responses — always confirm on official portals.
        </p>
      </div>

      {/* Chat */}
      <div className="card overflow-hidden animate-fade-up" style={{ animationDelay: '60ms' }}>
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-navy-900 to-navy-800 text-white">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-teal-300" />
            <span className="font-bold text-sm">SchemeSaathi Assistant</span>
            <span className="chip bg-white/10 text-navy-200 text-[10px] hidden sm:inline">Demo replies</span>
          </div>
          <button
            onClick={() => setMessages([{ id: 2, role: 'ai', text: getGreeting(lang) }])}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear chat
          </button>
        </div>

        <div ref={scrollRef} className="h-[300px] overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === 'user' ? 'bg-teal-600' : 'bg-navy-800'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-teal-300" />}
              </div>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-sm'
                    : 'bg-white text-navy-800 shadow-soft border border-slate-100 rounded-tl-sm'
                }`}
              >
                {m.text}
                {m.schemeIds && m.schemeIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {m.schemeIds.map((id) => {
                      const s = SCHEMES.find((x) => x.id === id);
                      if (!s) return null;
                      return (
                        <a
                          key={id}
                          href={`#/scheme/${id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState({}, '', `/scheme/${id}`);
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }}
                          className="chip bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors"
                        >
                          {s.name}
                        </a>
                      );
                    })}
                  </div>
                )}
                {m.followUps && (
                  <div className="flex flex-col gap-1.5 mt-3">
                    {m.followUps.map((f) => (
                      <button
                        key={f}
                        onClick={() => send(f)}
                        className="text-left text-xs px-3 py-2 rounded-full border border-teal-200 text-teal-700 bg-teal-50/50 hover:bg-teal-100 transition-colors"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-teal-300" />
              </div>
              <div className="bg-white px-4 py-3.5 rounded-2xl shadow-soft border border-slate-100 flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-teal-400 animate-pulse-soft"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
                <span className="text-xs text-slate-400 ml-1">Searching schemes…</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-100 flex gap-2 bg-white">
          <button
            onClick={() => {
              setListening(true);
              setTimeout(() => {
                setListening(false);
                setInput(EXAMPLE);
              }, 1200);
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
              listening ? 'bg-accent-100 text-accent-600 animate-pulse-soft' : 'bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-600'
            }`}
            aria-label="Voice input (simulated)"
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder={listening ? 'Listening…' : 'Describe your situation, e.g. "I am a student needing a scholarship"'}
            className="flex-1 input-base !py-2.5"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            className="btn-primary !px-4 shrink-0"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-5 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-4 h-4 text-teal-600" />
          <h2 className="font-bold text-navy-900">Search & filter schemes</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search schemes…"
              className="input-base !pl-10"
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category | 'All')} className="input-base">
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="flex gap-3">
            <select value={deadline} onChange={(e) => setDeadline(e.target.value as DeadlineFilter)} className="input-base">
              <option value="all">Any deadline</option>
              <option value="7">Next 7 days</option>
              <option value="30">Next 30 days</option>
              <option value="90">Next 90 days</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="input-base">
              <option value="relevance">Sort: Relevance</option>
              <option value="deadline">Sort: Deadline</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-navy-900">
            {hasSearched ? `${results.length} scheme(s) found` : 'All schemes'}
          </h2>
          <span className="text-xs text-slate-400 italic">Illustrative data — not verified claims</span>
        </div>
        {results.length === 0 ? (
          <div className="card p-12 text-center animate-fade-in">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-navy-900 mb-1">No schemes match your filters</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Try a different category, widen the deadline window, or describe your situation in the chat above for
              personalised suggestions.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((s, i) => (
              <SchemeCard key={s.id} scheme={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
