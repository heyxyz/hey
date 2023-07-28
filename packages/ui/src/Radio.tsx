import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

interface RadioProps {
  title?: string;
  message?: ReactNode;
  className?: string;
  name: string;
}

export const Radio: FC<RadioProps> = ({
  title,
  message,
  className = '',
  name
}) => {
  if (!message) {
    return null;
  }

  return (
    <div className={clsx('flex items-center space-x-2 p-2', className)}>
      <input
        type="radio"
        name={name}
        className="text-brand dark:text-brand h-4 w-4"
      />
      <div>
        <h3 className="text-base font-medium">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="text-sm">{message}</div>
        </div>
      </div>
    </div>
  );
};
