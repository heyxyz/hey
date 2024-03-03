import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

import { forwardRef } from 'react';

import cn from '../cn';

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  outline?: boolean;
  size?: 'lg' | 'md' | 'sm';
  variant?: 'danger' | 'primary' | 'secondary' | 'warning';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className = '',
      icon,
      outline,
      size = 'md',
      variant = 'primary',
      ...rest
    },
    ref
  ) {
    const commonStyles = {
      'border border-black dark:border-white': variant === 'primary',
      'border border-gray-600': variant === 'secondary',
      'border border-red-600': variant === 'danger',
      'border border-yellow-600 focus:ring-yellow-400/50': variant === 'warning'
    };

    const nonOutlineStyles = {
      'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 active:bg-black':
        !outline && variant === 'primary',
      'bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700':
        !outline && variant === 'secondary',
      'bg-red-500 text-white hover:bg-red-400 active:bg-red-700':
        !outline && variant === 'danger',
      'bg-yellow-500 text-white hover:bg-yellow-400 active:bg-yellow-700':
        !outline && variant === 'warning'
    };

    const outlineStyles = {
      'text-black hover:bg-gray-50 active:bg-gray-100 dark:text-white dark:hover:bg-gray-800 dark:active:bg-gray-700':
        outline && variant === 'primary',
      'text-gray-500 hover:bg-gray-50 active:bg-gray-100':
        outline && variant === 'secondary',
      'text-red-500 hover:bg-red-50 active:bg-red-100':
        outline && variant === 'danger',
      'text-yellow-500 hover:bg-yellow-50 active:bg-yellow-100':
        outline && variant === 'warning'
    };

    const sizeStyles = {
      'px-3 py-0.5 text-sm': size === 'sm',
      'px-4 py-1': size === 'md',
      'px-5 py-1.5': size === 'lg'
    };

    return (
      <button
        className={cn(
          {
            ...commonStyles,
            ...nonOutlineStyles,
            ...outlineStyles,
            ...sizeStyles,
            'inline-flex items-center space-x-1.5': icon && children
          },
          'rounded-full font-bold shadow-sm outline-2 outline-offset-2 focus:outline disabled:opacity-50',
          className
        )}
        ref={ref}
        type={rest.type}
        {...rest}
      >
        {icon ? icon : null}
        <div>{children}</div>
      </button>
    );
  }
);
