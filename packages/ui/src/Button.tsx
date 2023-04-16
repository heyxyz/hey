import clsx from 'clsx';
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { forwardRef } from 'react';

export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'warning' | 'super' | 'danger';
  outline?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    size = 'md',
    variant = 'primary',
    outline,
    leadingIcon = null,
    trailingIcon = null,
    children,
    className,
    ...rest
  } = props;
  return (
    <button
      className={clsx(
        'flex items-center justify-center space-x-2 rounded-lg border font-semibold focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50',
        size === 'sm' && 'h-8 px-3 py-1.5 text-xs leading-4',
        size === 'md' && 'h-9 px-3.5 py-2 text-sm leading-5',
        size === 'lg' && 'h-10 px-4 py-2.5 text-sm leading-5',
        !outline && 'text-white',
        variant === 'primary' && '',
        outline
          ? {
              'border-brand-500 text-brand-500 hover:bg-brand-600 focus:ring-brand-400 hover:text-white':
                variant === 'primary',
              'border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white focus:ring-gray-400':
                variant === 'secondary',
              'border-yellow-600 text-yellow-600 hover:bg-yellow-400 hover:text-white focus:ring-yellow-400':
                variant === 'warning',
              'border-pink-600 text-pink-600 hover:bg-pink-400 hover:text-white focus:ring-pink-400':
                variant === 'super',
              'border border-red-600 text-red-600 hover:bg-red-400 hover:text-white focus:ring-red-400':
                variant === 'danger'
            }
          : {
              'bg-brand-500 hover:bg-brand-600 border-brand-600 focus:ring-brand-400': variant === 'primary',
              'border-gray-600 bg-gray-500 hover:bg-gray-600 focus:ring-gray-400': variant === 'secondary',
              'border-yellow-600 bg-yellow-500 hover:bg-yellow-400 focus:ring-yellow-400':
                variant === 'warning',
              'border-pink-600 bg-pink-500 hover:bg-pink-400 focus:ring-pink-400': variant === 'super',
              'border border-red-600 bg-red-500 text-white hover:bg-red-400 focus:ring-red-400':
                variant === 'danger'
            },
        className
      )}
      {...rest}
      ref={ref}
    >
      {leadingIcon}
      {children ? <span>{children}</span> : null}
      {trailingIcon}
    </button>
  );
});
