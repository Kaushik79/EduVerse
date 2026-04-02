import { cn } from '../../lib/utils';

export function ActivityFeed({ activities = [], className }) {
  const getIndicatorColor = (type) => {
    switch (type) {
      case 'submission': return 'bg-success';
      case 'question': return 'bg-accent';
      case 'access': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className={cn('w-2 h-2 rounded-full mt-2 shrink-0', getIndicatorColor(activity.type))} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text">{activity.title}</p>
            <p className="text-xs text-text-muted truncate">{activity.description}</p>
          </div>
          <span className="text-xs text-text-muted whitespace-nowrap">{activity.time}</span>
        </div>
      ))}
    </div>
  );
}
