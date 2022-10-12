import type { Profile } from '@generated/types';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import getAvatar from '@lib/getAvatar';
import isVerified from '@lib/isVerified';
import type { Message } from '@xmtp/xmtp-js';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';

dayjs.extend(relativeTime);

interface Props {
  profile: Profile;
  message: Message;
}

const Preview: FC<Props> = ({ profile, message }) => {
  const router = useRouter();

  const onConversationSelected = (address: string) => {
    router.push(address ? `/messages/${address}` : '/messages');
  };

  return (
    <div onClick={() => onConversationSelected(profile.ownedBy)}>
      <div className="flex justify-between pb-4 space-x-1.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link href={`/u/${profile?.handle}`}>
              <img
                src={getAvatar(profile)}
                loading="lazy"
                className={clsx('w-10 h-10', 'bg-gray-200 rounded-full border dark:border-gray-700/80')}
                height={40}
                width={40}
                alt={profile?.handle}
              />
            </Link>
            <div>
              <div className="flex gap-1 items-center max-w-sm truncate">
                <div className={clsx('text-md')}>{profile?.name ?? profile?.handle}</div>
                {isVerified(profile?.id) && <BadgeCheckIcon className="w-4 h-4 text-brand" />}
              </div>
              <span className="text-sm text-gray-500">{message.content}</span>
            </div>
          </div>
        </div>
        {message.sent && (
          <span className="text-xs text-gray-500">{dayjs(new Date(message.sent)).fromNow()}</span>
        )}
      </div>
    </div>
  );
};

export default Preview;
