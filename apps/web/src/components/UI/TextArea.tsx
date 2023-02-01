import type { ComponentProps } from 'react';
import { forwardRef, useId } from 'react';

import { FieldError } from './Form';

interface Props extends ComponentProps<'textarea'> {
  label?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(function TextArea({ label, ...props }, ref) {
  const id = useId();

  return (
    <label htmlFor={id}>
      {label && <div className="label">{label}</div>}
      <textarea
        id={id}
        className="focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white py-2 px-4 shadow-sm disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900"
        ref={ref}
        {...props}
      />
      {props.name && <FieldError name={props.name} />}
    </label>
  );
});
