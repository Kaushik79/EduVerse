import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export function Input({ className, type = 'text', icon: Icon, label, error, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text mb-1.5">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon size={18} />
          </div>
        )}
        <input
          type={inputType}
          className={cn(
            'w-full h-11 px-4 text-sm bg-white border border-border rounded-lg',
            'placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
            'transition-all duration-200',
            Icon && 'pl-10',
            isPassword && 'pr-10',
            error && 'border-danger focus:ring-danger/20 focus:border-danger',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}
