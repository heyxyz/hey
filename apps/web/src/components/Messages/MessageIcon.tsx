import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { FC } from 'react';

const MessageIcon: FC = () => {
  return (
    <Link
      href="/messages"
      className="hidden min-w-[40px] items-start justify-center rounded-md p-1 hover:bg-gray-300/20 md:flex"
    >
      <EnvelopeIcon className="h-5 w-5 sm:h-6 sm:w-6" />
    </Link>
  );
};

export default MessageIcon;
