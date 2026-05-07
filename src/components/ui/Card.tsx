import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, padding = 'md' }: CardProps) {
  const padMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', padMap[padding], className)}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  accent?: boolean;
  trend?: { value: number; label: string };
}

export function StatCard({ label, value, sub, icon, accent, trend }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-xl border p-5 flex flex-col gap-3',
      accent ? 'bg-primary text-white border-primary-dark' : 'bg-white border-gray-200 shadow-sm',
    )}>
      <div className="flex items-start justify-between">
        <span className={cn('text-sm font-medium', accent ? 'text-red-100' : 'text-gray-500')}>
          {label}
        </span>
        {icon && (
          <div className={cn('p-2 rounded-lg', accent ? 'bg-primary-dark/30' : 'bg-red-50')}>
            <span className={cn('text-lg', accent ? 'text-white' : 'text-primary')}>{icon}</span>
          </div>
        )}
      </div>
      <div>
        <p className={cn('text-2xl font-bold leading-none', accent ? 'text-white' : 'text-gray-900')}>
          {value}
        </p>
        {sub && <p className={cn('text-xs mt-1', accent ? 'text-red-200' : 'text-gray-400')}>{sub}</p>}
      </div>
      {trend && (
        <div className={cn('text-xs flex items-center gap-1', trend.value >= 0 ? (accent ? 'text-green-300' : 'text-green-600') : (accent ? 'text-red-200' : 'text-red-500'))}>
          <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
          <span className={accent ? 'text-red-200' : 'text-gray-400'}>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
