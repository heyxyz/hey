import clsx from 'clsx';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';

interface TabButtonProps {
  name: string;
  icon: ReactNode;
  active: boolean;
  type?: string;
  showOnSm?: boolean;
  onClick: () => void;
}

const TabButton: FC<TabButtonProps> = ({ name, icon, active, type, showOnSm = false, onClick }) => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (type) {
          router.replace({ query: { ...router.query, type } }, undefined, { shallow: true });
        }
        onClick();
      }}
      className={clsx(
        {
          'text-dark bg-brand-500 flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium hover:cursor-default sm:px-3 sm:py-1.5':
            active
        },
        {
          'text-dark dark:hover:text-dark hover:bg-brand-500 flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium dark:text-white sm:px-3 sm:py-1.5':
            !active
        }
      )}
      aria-label={name}
    >
      {icon}
      <span className={clsx({ 'hidden uppercase sm:block': !showOnSm })}>{name}</span>
    </button>
  );
};

export default TabButton;
