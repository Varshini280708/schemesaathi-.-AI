export function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function deadlineLabel(dateStr: string): string {
  const d = daysUntil(dateStr);
  if (d < 0) return 'Closed';
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  if (d <= 7) return `${d} days left`;
  if (d <= 30) return `${d} days left`;
  return `${Math.round(d / 30)} months left`;
}
