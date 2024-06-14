import type { FC } from 'react';

import { EnvelopeIcon as EnvelopeIconOutline } from '@heroicons/react/24/outline';
import { EnvelopeIcon as EnvelopeIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MessagesIcon: FC = () => {
  const { pathname } = useRouter();
  const isMessagesPage = pathname === '/messages';

  return (
    <Link
      className="mb-4 flex cursor-pointer items-start space-x-2 rounded-md px-2 py-1 hover:bg-gray-300/20 md:flex"
      href="/messages"
    >
      {isMessagesPage ? (
        <EnvelopeIconSolid className="size-8" />
      ) : (
        <EnvelopeIconOutline className="size-8" />
      )}
      <span
        className={`text-xl text-black dark:text-white ${isMessagesPage ? 'font-bold' : ''}`}
      >
        Messages
      </span>
    </Link>
  );
};

export default MessagesIcon;
