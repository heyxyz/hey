import type { FC } from 'react';
import { Tooltip } from '@good/ui';
import { EnvelopeIcon as EnvelopeIconOutline } from '@heroicons/react/24/outline';
import { EnvelopeIcon as EnvelopeIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MessagesIcon: FC = () => {
  const { pathname } = useRouter();
  const isMessagesPage = pathname === '/messages';

  return (
    <Link
      className="cursor-pointer rounded-md mb-4 px-2 py-1 flex items-start space-x-2 hover:bg-gray-300/20 md:flex"
      href="/messages"
    >
      {isMessagesPage ? (
        <EnvelopeIconSolid className="size-8" />
      ) : (
        <EnvelopeIconOutline className="size-8" />
      )}
      <span className={`dark:text-white text-black text-xl ${isMessagesPage ? 'font-bold' : ''}`}>Messages</span>
    </Link>
  );
};

export default MessagesIcon;
