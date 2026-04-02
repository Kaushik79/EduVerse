import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SearchBar({ placeholder = 'Search...', className, ...props }) {
  return (
    <div className={cn('relative', className)}>
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-border rounded-lg placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
        {...props}
      />
    </div>
  );
}
