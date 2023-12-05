import type { FC, ReactNode } from 'react';

import { useRouter } from 'next/router';

import cn from '../cn';

interface TabButtonProps {
  active: boolean;
  className?: string;
  count?: string;
  icon?: ReactNode;
  name: string;
  onClick: () => void;
  showOnSm?: boolean;
  type?: string;
}

const TabButton: FC<TabButtonProps> = ({
  active,
  className = '',
  count,
  icon,
  name,
  onClick,
  showOnSm = false,
  type
}) => {
  const router = useRouter();

  return (
    <button
      aria-label={name}
      className={cn(
        {
          '!text-brand-500 dark:!text-brand-400/80 bg-brand-100 dark:bg-brand-300/20':
            active
        },
        'flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 sm:px-3 sm:py-1.5',
        'hover:bg-brand-100/80 hover:text-brand-400 dark:hover:bg-brand-300/30 outline-brand-500 justify-center',
        className
      )}
      onClick={() => {
        if (type) {
          router.replace({ query: { ...router.query, type } }, undefined, {
            shallow: true
          });
        }
        onClick();
      }}
      type="button"
    >
      {icon}
      <span className={cn({ 'hidden sm:block': !showOnSm })}>{name}</span>
      {count ? (
        <span
          className={cn(
            active
              ? 'bg-brand-500 dark:bg-brand-500/80 text-white dark:text-white'
              : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
            'ml-2 rounded-2xl px-2 py-0.5 text-xs font-bold'
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
};

export default TabButton;
