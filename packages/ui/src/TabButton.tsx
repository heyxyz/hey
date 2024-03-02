import type { FC, ReactNode } from 'react';

import { useRouter } from 'next/router';

import cn from '../cn';

interface TabButtonProps {
  active: boolean;
  className?: string;
  hideOnSm?: boolean;
  icon?: ReactNode;
  name: string;
  onClick: () => void;
  type?: string;
}

const TabButton: FC<TabButtonProps> = ({
  active,
  className = '',
  hideOnSm = false,
  name,
  onClick,
  type
}) => {
  const router = useRouter();

  return (
    <button
      aria-label={name}
      className={className}
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
      <span
        className={cn(
          active ? 'font-bold' : 'ld-text-gray-500',
          { 'hidden sm:block': hideOnSm },
          'text-md sm:text-sm'
        )}
      >
        {name}
      </span>
      <div
        className={cn(
          'mt-0.5',
          active
            ? 'border-brand-500 border-b-4'
            : 'border-b-4 border-transparent'
        )}
      />
    </button>
  );
};

export default TabButton;
