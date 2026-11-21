import { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, Bot, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getGreeting, getAssistantReply, SUGGESTED_QUESTIONS } from '@/lib/ai';

interface Msg {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const { lang } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: 1, role: 'ai', text: getGreeting(lang) }]);
    }
  }, [open, messages.length, lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: Date.now(), role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'ai', text: getAssistantReply(text) }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-navy-800 text-white shadow-lift flex items-center justify-center hover:scale-110 transition-transform duration-200 animate-pulse-soft"
          aria-label="Open AI assistant"
        >
          <Bot className="w-7 h-7" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm h-[480px] max-h-[70vh] bg-white rounded-2xl shadow-lift border border-slate-200 flex flex-col overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-navy-900 to-navy-800 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <div className="text-sm font-bold">SchemeSaathi Assistant</div>
                <div className="text-[10px] text-navy-200">Demo replies — not official guidance</div>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setMessages([{ id: 2, role: 'ai', text: getGreeting(lang) }])}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-sm'
                      : 'bg-white text-navy-800 shadow-soft border border-slate-100 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl shadow-soft border border-slate-100 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-teal-400 animate-pulse-soft"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            {messages.length <= 1 && !typing && (
              <div className="flex flex-col gap-1.5 pt-1">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-left text-[11px] px-3 py-2 rounded-full border border-teal-200 text-teal-700 bg-white hover:bg-teal-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-2.5 border-t border-slate-100 bg-white flex gap-2">
            <button
              onClick={() => {
                setListening(true);
                setTimeout(() => {
                  setListening(false);
                  setInput('What schemes are available for me?');
                }, 1200);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                listening ? 'bg-accent-100 text-accent-600 animate-pulse-soft' : 'bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-600'
              }`}
              aria-label="Voice input (simulation)"
            >
              <Mic className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder={listening ? 'Listening…' : 'Ask about schemes…'}
              className="flex-1 text-sm rounded-xl border border-slate-200 px-3.5 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-teal-700 transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
