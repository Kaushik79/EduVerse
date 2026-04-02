import { cn } from '../../lib/utils';

export function Table({ className, children, ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }) {
  return <thead className={cn('', className)} {...props}>{children}</thead>;
}

export function TableBody({ className, children, ...props }) {
  return <tbody className={cn('', className)} {...props}>{children}</tbody>;
}

export function TableRow({ className, children, ...props }) {
  return <tr className={cn('border-b border-border last:border-0', className)} {...props}>{children}</tr>;
}

export function TableHead({ className, children, ...props }) {
  return (
    <th className={cn('text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider', className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }) {
  return (
    <td className={cn('py-3 px-4 text-text', className)} {...props}>
      {children}
    </td>
  );
}
