import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted';

const variants: Record<BadgeVariant, string> = {
  default:  'bg-gray-100 text-gray-800',
  success:  'bg-green-100 text-green-800',
  warning:  'bg-amber-100 text-amber-800',
  danger:   'bg-red-100 text-red-800',
  info:     'bg-blue-100 text-blue-800',
  muted:    'bg-gray-50 text-gray-500 border border-gray-200',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    pending:      { variant: 'warning', label: 'Pending' },
    under_review: { variant: 'info',    label: 'Under Review' },
    approved:     { variant: 'success', label: 'Approved' },
    rejected:     { variant: 'danger',  label: 'Rejected' },
    expired:      { variant: 'muted',   label: 'Expired' },
    planning:     { variant: 'info',    label: 'Planning' },
    design:       { variant: 'warning', label: 'Design' },
    construction: { variant: 'info',    label: 'Construction' },
    completed:    { variant: 'success', label: 'Completed' },
    on_hold:      { variant: 'muted',   label: 'On Hold' },
  };
  const { variant, label } = map[status] ?? { variant: 'default', label: status };
  return <Badge variant={variant}>{label}</Badge>;
}

export function TierBadge({ tier }: { tier: string }) {
  const map: Record<string, { color: string; label: string }> = {
    city:    { color: 'bg-red-600 text-white',   label: 'City' },
    subcity: { color: 'bg-red-400 text-white',   label: 'Sub-City' },
    wereda:  { color: 'bg-red-200 text-red-900', label: 'Wereda' },
  };
  const { color, label } = map[tier] ?? { color: 'bg-gray-100 text-gray-700', label: tier };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold', color)}>
      {label}
    </span>
  );
}
