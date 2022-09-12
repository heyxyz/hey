import { ComponentProps, forwardRef, useId } from 'react';

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
        className="py-2 px-4 w-full bg-white rounded-xl border border-gray-300 shadow-sm dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
        ref={ref}
        {...props}
      />
      {props.name && <FieldError name={props.name} />}
    </label>
  );
});
