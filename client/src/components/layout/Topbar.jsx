import { SearchBar } from '../shared/SearchBar';
import { Button } from '../ui/Button';
import { Upload } from 'lucide-react';

export function Topbar({ title, subtitle, actions, showSearch = true }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-text">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {showSearch && (
          <SearchBar placeholder="Search students, classes..." className="w-64" />
        )}
        {actions}
      </div>
    </div>
  );
}
