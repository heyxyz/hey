import type { FC } from 'react';

import cn from '../cn';

interface SpinnerProps {
  className?: string;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  variant?: 'danger' | 'primary' | 'secondary' | 'success' | 'warning';
}

export const Spinner: FC<SpinnerProps> = ({
  className = '',
  size = 'md',
  variant = 'primary'
}) => {
  return (
    <div
      className={cn(
        {
          'border-brand-200 border-t-brand-600': variant === 'primary',
          'border-gray-200 border-t-gray-600': variant === 'secondary',
          'border-green-200 border-t-green-600': variant === 'success',
          'border-red-200 border-t-red-600': variant === 'danger',
          'border-yellow-200 border-t-yellow-600': variant === 'warning',
          'h-10 w-10 border-4': size === 'lg',
          'h-4 w-4 border-[2px]': size === 'xs',
          'h-5 w-5 border-2': size === 'sm',
          'h-8 w-8 border-[3px]': size === 'md'
        },
        'animate-spin rounded-full',
        className
      )}
    />
  );
};
