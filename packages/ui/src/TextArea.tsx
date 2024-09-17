import type { ComponentProps } from "react";

import { forwardRef, useId } from "react";

import { FieldError } from "./Form";

interface TextAreaProps extends ComponentProps<"textarea"> {
  label?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, ...props }, ref) {
    const id = useId();

    return (
      <label htmlFor={id}>
        {label ? <div className="label">{label}</div> : null}
        <textarea
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-gray-500 focus:ring-gray-400 disabled:bg-gray-500/20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900"
          id={id}
          ref={ref}
          {...props}
        />
        {props.name ? <FieldError name={props.name} /> : null}
      </label>
    );
  }
);
