import { SCHEMES } from '@/data/schemes';
import { useSchemes } from '@/store/useStore';
import { SchemeCard } from '@/components/SchemeCard';
import { Bookmark } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function Saved() {
  const { savedSchemes } = useStore();
  const allSchemes = useSchemes();
  const saved = savedSchemes.map((id) => allSchemes.find((s) => s.id === id)!).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-extrabold text-navy-950 flex items-center gap-3">
          <Bookmark className="w-7 h-7 text-teal-600" /> Saved Schemes
        </h1>
        <p className="text-slate-500 mt-1">Your bookmarked schemes for quick access.</p>
      </div>

      {saved.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-navy-900 mb-1">No saved schemes yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Tap the bookmark icon on any scheme card to save it here for later.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {saved.map((s, i) => (
            <SchemeCard key={s.id} scheme={s} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
