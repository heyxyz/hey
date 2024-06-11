import type { FC } from 'react';
import { Tooltip } from '@good/ui';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const MessagesIcon: FC = () => {
  return (
    <Link
      className="cursor-pointer rounded-md px-2 py-1 flex items-start space-x-2 hover:bg-gray-300/20 md:flex"
      href="/messages"
    >
      <EnvelopeIcon className="size-6" /> 
      <span>Messages</span> 
    </Link>
  );
};

export default MessagesIcon;
