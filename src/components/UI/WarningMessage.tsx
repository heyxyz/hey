import { FC, ReactNode } from 'react';

interface Props {
  title?: string;
  message?: ReactNode;
  className?: string;
}

export const WarningMessage: FC<Props> = ({ title, message, className = '' }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-10 border-2 border-yellow-500 border-opacity-50 p-4 space-y-1 rounded-xl ${className}`}
    >
      {title && <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{title}</h3>}
      <div className="text-sm text-yellow-700 dark:text-yellow-200">{message}</div>
    </div>
  );
};
