import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark shadow-sm',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-200',
  ghost:     'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-100',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-700 shadow-sm',
  outline:   'border border-primary text-primary hover:bg-red-50 active:bg-red-50',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-sm',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', icon, children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
