export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function isExpired(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export function isExpiringSoon(dateStr: string | undefined, days = 30): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff <= days;
}

export function daysUntilExpiry(dateStr: string | undefined): number | null {
  if (!dateStr) return null;
  const diff = (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return Math.ceil(diff);
}

export function fileIcon(type: string): string {
  switch (type) {
    case 'cad': return '📐';
    case 'revit': return '🏗️';
    case 'pdf': return '📄';
    case 'image': return '🖼️';
    default: return '📎';
  }
}
