import { BookmarkIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';

interface BookmarksProps {
  onClick?: () => void;
  className?: string;
}

const Bookmarks: FC<BookmarksProps> = ({ onClick, className = '' }) => {
  return (
    <Link
      href="/bookmarks"
      className={clsx(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={onClick}
    >
      <BookmarkIcon className="h-4 w-4" />
      <div>
        <Trans>Bookmarks</Trans>
      </div>
    </Link>
  );
};

export default Bookmarks;
