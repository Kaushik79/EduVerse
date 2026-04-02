import { cn } from '../../lib/utils';

export function Avatar({ className, src, alt, fallback, size = 'default', ...props }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    default: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-14 w-14 text-lg',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={cn('rounded-full object-cover', sizes[size], className)}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center',
        sizes[size],
        className
      )}
      {...props}
    >
      {fallback || alt?.charAt(0) || '?'}
    </div>
  );
}
