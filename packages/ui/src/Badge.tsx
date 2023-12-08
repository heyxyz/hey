import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

import { forwardRef } from 'react';

import cn from '../cn';

interface BadgeProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: ReactNode;
  size?: 'lg' | 'md' | 'sm';
  variant?: 'black' | 'danger' | 'primary' | 'secondary' | 'warning';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { children, size = 'sm', variant = 'primary', ...rest },
  ref
) {
  const variantStyles = {
    'border-black/80 bg-black/70': variant === 'black',
    'border-brand-500/80 bg-brand-500/70': variant === 'primary',
    'border-gray-500/80 bg-gray-500/70': variant === 'secondary',
    'border-red-500/80 bg-red-500/70': variant === 'danger',
    'border-yellow-500/80 bg-yellow-500/70': variant === 'warning'
  };

  const sizeStyles = {
    'px-2': size === 'sm',
    'px-2 py-0.5': size === 'md',
    'px-2.5 py-1': size === 'lg'
  };

  return (
    <span
      className={cn(
        variantStyles,
        sizeStyles,
        'w-fit rounded-full border text-xs text-white shadow-sm'
      )}
      {...rest}
      ref={ref}
    >
      {children}
    </span>
  );
});
