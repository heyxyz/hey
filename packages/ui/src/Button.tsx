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
  rounded?: boolean;
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
      rounded = false,
      size = 'md',
      variant = 'primary',
      ...rest
    },
    ref
  ) {
    const commonStyles = {
      'border border-black focus:ring-black dark:border-white':
        variant === 'primary',
      'border border-gray-600 focus:ring-gray-400/50': variant === 'secondary',
      'border border-red-600 focus:ring-red-400/50': variant === 'danger',
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

    const roundedStyles = {
      'rounded-full': rounded,
      'rounded-lg': !rounded
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
            ...roundedStyles,
            'inline-flex items-center space-x-1.5': icon && children
          },
          'font-bold shadow-sm outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50',
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
