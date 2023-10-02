import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { forwardRef } from 'react';

import cn from '../cn';

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'warning' | 'black' | 'danger';
  outline?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className = '',
      size = 'md',
      variant = 'primary',
      outline,
      icon,
      children,
      ...rest
    },
    ref
  ) {
    const commonStyles = {
      'border-brand-600 focus:ring-brand-400/50 border': variant === 'primary',
      'border border-gray-600 focus:ring-gray-400/50': variant === 'secondary',
      'border border-yellow-600 focus:ring-yellow-400/50':
        variant === 'warning',
      'border border-black focus:ring-black': variant === 'black',
      'border border-red-600 focus:ring-red-400/50': variant === 'danger'
    };

    const nonOutlineStyles = {
      'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white':
        !outline && variant === 'primary',
      'bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700':
        !outline && variant === 'secondary',
      'bg-yellow-500 text-white hover:bg-yellow-400 active:bg-yellow-700':
        !outline && variant === 'warning',
      'bg-black text-white hover:bg-gray-900 active:bg-black':
        !outline && variant === 'black',
      'bg-red-500 text-white hover:bg-red-400 active:bg-red-700':
        !outline && variant === 'danger'
    };

    const outlineStyles = {
      'text-brand hover:bg-brand-50 active:bg-brand-100':
        outline && variant === 'primary',
      'text-gray-500 hover:bg-gray-50 active:bg-gray-100':
        outline && variant === 'secondary',
      'text-yellow-500 hover:bg-yellow-50 active:bg-yellow-100':
        outline && variant === 'warning',
      'text-black hover:bg-gray-50 active:bg-black':
        outline && variant === 'black',
      'text-red-500 hover:bg-red-50 active:bg-red-100':
        outline && variant === 'danger'
    };

    const sizeStyles = {
      'px-3 py-0.5 text-sm': size === 'sm',
      'px-3 py-1': size === 'md',
      'px-4 py-1.5': size === 'lg'
    };

    return (
      <button
        ref={ref}
        className={cn(
          {
            ...commonStyles,
            ...nonOutlineStyles,
            ...outlineStyles,
            ...sizeStyles,
            'inline-flex items-center space-x-1.5': icon && children
          },
          'rounded-lg font-bold shadow-sm outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50',
          className
        )}
        type={rest.type}
        {...rest}
      >
        {icon ? icon : null}
        <div>{children}</div>
      </button>
    );
  }
);
