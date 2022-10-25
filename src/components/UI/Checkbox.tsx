import clsx from 'clsx';
import type { ComponentProps } from 'react';
import { forwardRef, useId } from 'react';

interface Props extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string;
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(function CheckBox(
  { label, className = '', ...props },
  ref
) {
  const id = useId();

  return (
    <div className="flex items-center">
      <input
        ref={ref}
        className={clsx(
          'appearance-none h-4 w-4 border border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer',
          className
        )}
        type="checkbox"
        id={id}
        {...props}
      />
      <label className="text-sm whitespace-nowrap inline-block dark:text-gray-200 text-gray-800" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});
