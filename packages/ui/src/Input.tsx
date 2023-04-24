import clsx from 'clsx';
import dynamic from 'next/dynamic';
import type { ComponentProps, ReactNode } from 'react';
import { forwardRef, useId } from 'react';

import { FieldError } from './Form';

const HelpTooltip = dynamic(() => import('./HelpTooltip'));

interface InputProps extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string;
  prefix?: string | ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  helper?: ReactNode;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, prefix, type = 'text', iconLeft, iconRight, error, className = '', helper, ...props },
  ref
) {
  const id = useId();

  const iconStyles = [
    'text-zinc-500 [&>*]:peer-focus:text-brand [&>*]:h-5',
    { '!text-red-500 [&>*]:peer-focus:!text-red-500': error }
  ];

  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="mb-1 flex items-center space-x-1.5">
          <div className="font-medium text-gray-800 dark:text-gray-200">{label}</div>
          <HelpTooltip content={helper} />
        </div>
      )}
      <div className="flex">
        {prefix && (
          <span className="lt-text-gray-500 inline-flex items-center rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 px-3 dark:border-gray-700 dark:bg-gray-900">
            {prefix}
          </span>
        )}
        <div
          className={clsx(
            { 'bg-brand-500 bg-opacity-20 opacity-60': props.disabled },
            error && '!border-red-500',
            prefix ? 'rounded-r-full' : 'rounded-full',
            'focus-within:bg-brand-500 flex w-full items-center bg-white'
          )}
        >
          <input
            id={id}
            className={clsx(
              { 'placeholder-red-500': error },
              prefix ? 'rounded-r-xl' : 'rounded-xl',
              'autofill:shadow-transparentfocus-within:border-none peer w-full border-none bg-none text-black outline-none ring-0 autofill:bg-transparent focus-within:bg-transparent focus:border-none focus:bg-transparent focus:ring-0',
              className
            )}
            type={type}
            ref={ref}
            {...props}
          />
          <span tabIndex={-1} className={clsx({ 'order-first pl-3': iconLeft }, iconStyles)}>
            {iconLeft}
          </span>
          <span tabIndex={-1} className={clsx({ 'order-last pr-3': iconRight }, iconStyles)}>
            {iconRight}
          </span>
        </div>
      </div>
      {props.name && <FieldError name={props.name} />}
    </label>
  );
});
