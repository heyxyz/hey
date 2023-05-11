import clsx from 'clsx';
import type { ComponentProps } from 'react';
import { forwardRef, useId } from 'react';

interface CheckboxProps extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string;
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function CheckBox({ label, className = '', ...props }, ref) {
    const id = useId();

    return (
      <div className="flex items-center">
        <input
          ref={ref}
          className={clsx(
            'text-brand focus:ring-brand-500 mr-2 cursor-pointer rounded border-gray-300 transition duration-200',
            className
          )}
          type="checkbox"
          id={id}
          {...props}
        />
        <label
          className="inline-block whitespace-nowrap text-sm text-gray-800 dark:text-gray-200"
          htmlFor={id}
        >
          {label}
        </label>
      </div>
    );
  }
);
