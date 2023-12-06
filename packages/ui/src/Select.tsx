import type { ComponentProps } from 'react';

import { forwardRef, useId } from 'react';

import cn from '../cn';

interface SelectProps extends ComponentProps<'select'> {
  className?: string;
  label?: string;
  options?: {
    disabled?: boolean;
    label: string;
    selected?: boolean;
    value: number | string;
  }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className = '', label, options, ...rest }, ref) {
    const id = useId();

    return (
      <label htmlFor={id}>
        {label ? <div className="label">{label}</div> : null}
        <select
          className={cn(
            'focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white outline-none dark:border-gray-700 dark:bg-gray-800',
            className
          )}
          id={id}
          ref={ref}
          {...rest}
        >
          {options?.map(({ disabled, label, selected, value }) => (
            <option disabled={disabled} selected={selected} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    );
  }
);
