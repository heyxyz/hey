import clsx from 'clsx';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';

interface TabButtonProps {
  name: string;
  icon: ReactNode;
  active: boolean;
  type?: string;
  count?: string;
  className?: string;
  showOnSm?: boolean;
  onClick: () => void;
}

const TabButton: FC<TabButtonProps> = ({
  name,
  icon,
  active,
  type,
  count,
  showOnSm = false,
  className = '',
  onClick
}) => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (type) {
          router.replace({ query: { ...router.query, type } }, undefined, {
            shallow: true
          });
        }
        onClick();
      }}
      className={clsx(
        { 'text-brand bg-brand-100 dark:bg-brand-300/20': active },
        'flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 sm:px-3 sm:py-1.5',
        'hover:bg-brand-100/80 dark:hover:bg-brand-300/30 justify-center',
        className
      )}
      data-testid={`tab-button-${name.toLowerCase()}`}
      aria-label={name}
    >
      {icon}
      <span className={clsx({ 'hidden sm:block': !showOnSm })}>{name}</span>
      {count && (
        <span
          className={clsx(
            active
              ? 'bg-brand-500 dark:bg-brand-500/80 text-white dark:text-white'
              : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
            'ml-2 rounded-2xl px-2 py-0.5 text-xs font-bold'
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default TabButton;
