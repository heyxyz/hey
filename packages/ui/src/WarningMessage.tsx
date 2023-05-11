import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

interface WarningMessageProps {
  title?: string;
  message?: ReactNode;
  className?: string;
}

export const WarningMessage: FC<WarningMessageProps> = ({
  title,
  message,
  className = ''
}) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className={clsx(
        'space-y-1 rounded-xl border-2 border-yellow-500/50 bg-yellow-50 p-4 dark:bg-yellow-900/10',
        className
      )}
    >
      {title && (
        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          {title}
        </h3>
      )}
      <div className="text-sm text-yellow-700 dark:text-yellow-200">
        {message}
      </div>
    </div>
  );
};
