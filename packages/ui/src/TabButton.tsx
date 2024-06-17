import type { FC, ReactNode } from 'react';

import { useRouter } from 'next/router';

import cn from '../cn';

interface TabButtonProps {
  active: boolean;
  badge?: ReactNode;
  className?: string;
  icon?: ReactNode;
  name: string;
  onClick: () => void;
  showOnSm?: boolean;
  type?: string;
}

const TabButton: FC<TabButtonProps> = ({
  active,
  badge,
  className = '',
  icon,
  name,
  onClick,
  showOnSm = false,
  type
}) => {
  const router = useRouter();

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      style={active ? { borderBottom: '2px solid #da5597' } : {}}
    >
      <button
        aria-label={name}
        className={cn(
          'flex items-center justify-center space-x-2 text-sm sm:px-3 sm:py-1.5',
          'h-full w-full rounded-full hover:bg-gray-800',
          {
            'font-bold text-white': active,
            'text-gray-500': !active
          }
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
        {badge}
      </button>
    </div>
  );
};

export default TabButton;
