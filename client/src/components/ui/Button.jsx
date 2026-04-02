import { cn } from '../../lib/utils';

export function Button({ className, variant = 'default', size = 'default', children, ...props }) {
  const variants = {
    default: 'bg-primary text-white hover:bg-primary-light shadow-sm',
    secondary: 'bg-white text-text border border-border hover:bg-gray-50',
    outline: 'border border-border bg-transparent hover:bg-gray-50 text-text',
    ghost: 'hover:bg-gray-100 text-text-secondary',
    accent: 'bg-accent text-white hover:bg-accent-light shadow-sm',
    danger: 'bg-danger text-white hover:bg-red-600',
    success: 'bg-success text-white hover:bg-success-light',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-md',
    default: 'h-10 px-4 py-2 text-sm rounded-lg',
    lg: 'h-12 px-6 text-base rounded-lg',
    icon: 'h-10 w-10 rounded-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
