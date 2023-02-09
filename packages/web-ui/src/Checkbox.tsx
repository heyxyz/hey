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
          'float-left mr-2 h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none',
          className
        )}
        type="checkbox"
        id={id}
        {...props}
      />
      <label className="inline-block whitespace-nowrap text-sm text-gray-800 dark:text-gray-200" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});
