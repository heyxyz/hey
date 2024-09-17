import type { ComponentProps } from "react";

import { forwardRef, useId } from "react";

import cn from "../cn";

interface CheckboxProps extends Omit<ComponentProps<"input">, "prefix"> {
  className?: string;
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function CheckBox({ className = "", label, ...props }, ref) {
    const id = useId();

    return (
      <div className="flex items-center">
        <input
          className={cn(
            "mr-2 cursor-pointer rounded border-gray-300 text-black transition duration-200 focus:ring-gray-500 dark:text-gray-500",
            className
          )}
          id={id}
          ref={ref}
          type="checkbox"
          {...props}
        />
        <label className="inline-block whitespace-nowrap text-sm" htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }
);
