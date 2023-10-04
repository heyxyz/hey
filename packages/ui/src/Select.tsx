import type { ComponentProps } from 'react';
import { forwardRef, useId } from 'react';

interface SelectProps extends ComponentProps<'select'> {
  label?: string;
  values: string[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function TextArea({ label, values }, ref) {
    const id = useId();

    return (
      <label htmlFor={id}>
        {label ? <div className="label">{label}</div> : null}
        <select
          id={id}
          className="focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white outline-none dark:border-gray-700 dark:bg-gray-800"
          ref={ref}
        >
          {values.map((value: string) => (
            <option value={value}>{value}</option>
          ))}
        </select>
      </label>
    );
  }
);
