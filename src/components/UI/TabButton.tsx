import nFormatter from '@lib/nFormatter';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

interface Props {
  name: string;
  icon: ReactNode;
  active: boolean;
  count?: number;
  showOnSm?: boolean;
  onClick: () => void;
}

const TabButton: FC<Props> = ({ name, icon, active, count, showOnSm = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        { 'text-brand bg-brand-100 dark:bg-opacity-20 bg-opacity-100': active },
        'flex items-center space-x-2 rounded-lg text-sm px-4 sm:px-3 font-medium py-2 sm:py-1.5 text-gray-500 hover:bg-brand-100 dark:hover:bg-opacity-20 hover:bg-opacity-100'
      )}
      aria-label={name}
    >
      {icon}
      <span className={clsx({ 'hidden sm:block': !showOnSm })}>{name}</span>
      {count ? (
        <span
          className={clsx(
            { 'bg-brand-200 dark:bg-brand-800': active },
            'px-2 text-xs rounded-full bg-gray-200 dark:bg-gray-800'
          )}
        >
          {nFormatter(count)}
        </span>
      ) : null}
    </button>
  );
};

export default TabButton;
