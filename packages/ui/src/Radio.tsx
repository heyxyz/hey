import type { InputHTMLAttributes, ReactNode } from 'react';

import { forwardRef, useId } from 'react';

import cn from '../cn';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  description?: ReactNode;
  heading: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className = '', description, heading, ...rest },
  ref
) {
  const id = useId();

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <input
        className="size-4 border text-black focus:ring-0 focus:ring-offset-0"
        id={id}
        ref={ref}
        type="radio"
        {...rest}
      />
      <label htmlFor={id}>
        <div>{heading}</div>
        {description ? <div className="text-sm">{description}</div> : null}
      </label>
    </div>
  );
});
