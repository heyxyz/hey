import type { ComponentProps } from 'react';

import { forwardRef, useId } from 'react';

interface SelectProps extends ComponentProps<'select'> {
  label?: string;
  options: {
    label: string;
    value: number | string;
  }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function TextArea({ label, options, ...rest }, ref) {
    const id = useId();

    return (
      <label htmlFor={id}>
        {label ? <div className="label">{label}</div> : null}
        <select
          className="focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white outline-none dark:border-gray-700 dark:bg-gray-800"
          id={id}
          ref={ref}
          {...rest}
        >
          {options.map(({ label, value }) => (
            <option value={value}>{label}</option>
          ))}
        </select>
      </label>
    );
  }
);
