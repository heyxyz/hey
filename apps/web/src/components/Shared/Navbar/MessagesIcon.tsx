import type { FC } from 'react';

import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const MessagesIcon: FC = () => {
  return (
    <Link
      className="flex cursor-pointer items-start space-x-2 rounded-md px-2 py-1 hover:bg-gray-300/20 md:flex"
      href="/messages"
    >
      <EnvelopeIcon className="size-6" />
      <span>Messages</span>
    </Link>
  );
};

export default MessagesIcon;
