import type { FC, ReactNode } from 'react';

import cn from '@good/ui/cn';
import Link from 'next/link';

interface BookmarksProps {
  className?: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
  text?: string;
}

const Bookmarks: FC<BookmarksProps> = ({
  className = '',
  href = '',
  icon,
  onClick,
  text = ''
}) => {
  return (
    <Link
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      href={href}
      onClick={onClick}
    >
      {icon}
      <div>{text}</div>
    </Link>
  );
};

export default Bookmarks;
