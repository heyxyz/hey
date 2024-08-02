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
  disabled?: boolean;
  icon?: ReactNode;
  outline?: boolean;
  size?: 'lg' | 'md' | 'sm';
  variant?: 'danger' | 'primary' | 'warning';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className = '',
      disabled = false,
      icon,
      outline,
      size = 'md',
      variant = 'primary',
      ...rest
    },
    ref
  ) {
    const borderStyles = {
      'border border-black dark:border-white hover:border-gray-500':
        variant === 'primary',
      'border border-red-600 hover:border-red-400': variant === 'danger',
      'border border-yellow-600 focus:ring-yellow-400/50 hover:border-yellow-400':
        variant === 'warning'
    };

    const nonOutlineStyles = !outline && {
      'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-500 active:bg-black':
        variant === 'primary',
      'bg-red-500 text-white hover:bg-red-400 active:bg-red-700':
        variant === 'danger',
      'bg-yellow-500 text-white hover:bg-yellow-400 active:bg-yellow-700':
        variant === 'warning'
    };

    const outlineStyles = outline && {
      'text-black hover:bg-gray-50 active:bg-gray-100 dark:text-white dark:hover:bg-gray-800 dark:active:bg-gray-700':
        variant === 'primary',
      'text-red-500 hover:bg-red-50 active:bg-red-100': variant === 'danger',
      'text-yellow-500 hover:bg-yellow-50 active:bg-yellow-100':
        variant === 'warning'
    };

    const disabledStyles = disabled && {
      'text-gray-600 hover:bg-black hover:border-black': variant === 'primary',
      'text-red-600 hover:bg-red-500 hover:border-red-500 border-red-500':
        variant === 'danger',
      'text-yellow-600 hover:bg-yellow-500 hover:border-yellow-500 border-yellow-500':
        variant === 'warning'
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
            ...borderStyles,
            ...nonOutlineStyles,
            ...outlineStyles,
            ...sizeStyles,
            ...disabledStyles,
            'inline-flex items-center space-x-1.5': icon && children
          },
          'rounded-full font-bold shadow-sm outline-2 outline-offset-2 focus:outline',
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
