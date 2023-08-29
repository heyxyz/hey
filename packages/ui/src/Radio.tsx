import clsx from 'clsx';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useId } from 'react';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  heading: ReactNode;
  description?: ReactNode;
  className?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({
  heading,
  description,
  className = '',
  ...rest
}) {
  const id = useId();

  return (
    <div className={clsx('flex items-center space-x-3', className)}>
      <input
        id={id}
        type="radio"
        className="text-brand dark:text-brand h-4 w-4 border focus:ring-0 focus:ring-offset-0"
        {...rest}
      />
      <label htmlFor={id}>
        <div>{heading}</div>
        {description ? <div className="text-sm">{description}</div> : null}
      </label>
    </div>
  );
});
