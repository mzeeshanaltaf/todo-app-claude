import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'default' | 'danger';
  children: ReactNode;
}

const variantClasses: Record<string, string> = {
  default:
    'hover:bg-slate-100 text-slate-500 hover:text-slate-700 dark:hover:bg-slate-600 dark:text-slate-400 dark:hover:text-slate-200',
  danger:
    'hover:bg-red-50 text-slate-500 hover:text-red-600 dark:hover:bg-red-900/30 dark:text-slate-400 dark:hover:text-red-400',
};

export function IconButton({
  label,
  variant = 'default',
  children,
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      {...props}
      className={`p-1 rounded-md transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-blue-500 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
