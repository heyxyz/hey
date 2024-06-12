import type { FC } from 'react';
import { Tooltip } from '@good/ui';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const MessagesIcon: FC = () => {
  return (
    <Link
      className="cursor-pointer rounded-md mb-4 px-2 py-1 flex items-start space-x-2 hover:bg-gray-300/20 md:flex"
      href="/messages"
    >
      <EnvelopeIcon className="size-8" /> 
      <span className="text-white text-xl">Messages</span> 
    </Link>
  );
};

export default MessagesIcon;
