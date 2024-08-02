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
  variant?: 'danger' | 'primary';
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
    const nonOutlineTextStyles = !outline && {
      'text-white': variant === 'primary' || variant === 'danger'
    };

    const nonOutlineBgStyles = !outline && {
      'bg-black hover:bg-gray-500 active:bg-black': variant === 'primary',
      'bg-red-500 hover:bg-red-400 active:bg-red-700': variant === 'danger'
    };

    const nonOutlineBorderStyles = !outline && {
      'border-black dark:border-white': variant === 'primary',
      'border-red-600 dark:border-red-500': variant === 'danger'
    };

    const nonOutlineDarkStyles = !outline && {
      'border border-black dark:border-white hover:border-gray-500':
        variant === 'primary',
      'border border-red-600 hover:border-red-400': variant === 'danger'
    };

    const nonOutlineDisabledStyles = !outline &&
      disabled && {
        'text-gray-600 hover:bg-black hover:border-black':
          variant === 'primary',
        'text-red-600 hover:bg-red-500 hover:border-red-500 border-red-500':
          variant === 'danger'
      };

    const outlineTextStyles = outline && {
      'text-black dark:text-white': variant === 'primary',
      'text-red-500 hover:text-red-400': variant === 'danger'
    };

    const outlineBorderStyles = outline && {
      'border-black border border-gray-300 dark:border-white hover:border-gray-500':
        variant === 'primary',
      'border-red-600 border border-red-600 hover:border-red-400':
        variant === 'danger'
    };

    const outlineDisabledStyles = outline &&
      disabled && {
        'text-gray-600 hover:border-gray-300': variant === 'primary',
        'text-red-600 hover:border-red-500': variant === 'danger'
      };

    const sizeStyles = {
      'px-3 py-0.5 text-sm': size === 'sm',
      'px-4 py-1 text-sm': size === 'md',
      'px-5 py-1.5': size === 'lg'
    };

    return (
      <button
        className={cn(
          {
            ...nonOutlineTextStyles,
            ...nonOutlineBgStyles,
            ...nonOutlineBorderStyles,
            ...nonOutlineDarkStyles,
            ...nonOutlineDisabledStyles,
            ...outlineTextStyles,
            ...outlineBorderStyles,
            ...outlineDisabledStyles,
            ...sizeStyles,
            'inline-flex items-center space-x-1.5': icon && children
          },
          'rounded-full font-bold outline-2 outline-offset-2 focus:outline',
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
