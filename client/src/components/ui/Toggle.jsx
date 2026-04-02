import { cn } from '../../lib/utils';

export function Toggle({ className, checked, onChange, ...props }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
        checked ? 'bg-success' : 'bg-gray-300',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}
