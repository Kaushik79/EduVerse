import { cn } from '../../lib/utils';

export function StatCard({ title, value, change, changeType = 'positive', icon: Icon, className }) {
  return (
    <div className={cn('bg-bg-card rounded-xl border border-border p-5 flex items-start justify-between', className)}>
      <div>
        <p className="text-sm text-text-secondary mb-1">{title}</p>
        <p className="text-3xl font-bold text-text">{value}</p>
        {change && (
          <span className={cn(
            'text-xs font-medium mt-1 inline-block',
            changeType === 'positive' ? 'text-success' : 'text-danger'
          )}>
            {change}
          </span>
        )}
      </div>
      {Icon && (
        <div className="text-text-muted">
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
