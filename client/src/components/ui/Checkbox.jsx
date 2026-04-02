import { cn } from '../../lib/utils';

export function Checkbox({ className, label, ...props }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={cn(
          'h-4 w-4 rounded border-border text-accent focus:ring-accent/20',
          className
        )}
        {...props}
      />
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </label>
  );
}
