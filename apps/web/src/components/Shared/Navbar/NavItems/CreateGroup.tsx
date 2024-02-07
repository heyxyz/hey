import type { FC } from 'react';

import { UsersIcon } from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';
import Link from 'next/link';

interface CreateGroupProps {
  className?: string;
  onClick?: () => void;
}

const CreateGroup: FC<CreateGroupProps> = ({ className = '', onClick }) => {
  return (
    <Link
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      href="/-/create-group"
      onClick={onClick}
    >
      <UsersIcon className="size-4" />
      <div>Create Group</div>
    </Link>
  );
};

export default CreateGroup;
