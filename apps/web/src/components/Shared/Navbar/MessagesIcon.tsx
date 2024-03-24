import type { FC } from 'react';

import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@hey/ui';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import Link from 'next/link';

const MessagesIcon: FC = () => {
  if (!isFeatureAvailable('messages')) {
    return null;
  }

  return (
    <Tooltip content="Messages" placement="bottom">
      <Link
        className="hidden rounded-md px-2 py-1 hover:bg-gray-300/20 md:flex"
        href="/messages"
      >
        <EnvelopeIcon className="size-5 sm:size-6" />
      </Link>
    </Tooltip>
  );
};

export default MessagesIcon;
