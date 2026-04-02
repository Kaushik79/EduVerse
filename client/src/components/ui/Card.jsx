import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-bg-card rounded-xl border border-border shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('p-5 pb-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('text-base font-semibold text-text', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('p-5 pt-2', className)} {...props}>
      {children}
    </div>
  );
}
