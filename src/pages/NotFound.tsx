import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export function Notfound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-24 text-center">
      <SearchX className="w-14 h-14 text-slate-300 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-navy-950">Page not found</h1>
      <p className="text-slate-500 mt-2 mb-6">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}
