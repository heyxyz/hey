import UserProfile from '@components/Shared/UserProfile';
import type { Profile } from '@generated/types';
import type { Message } from '@xmtp/xmtp-js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
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
    router.push(address ? `/messages/${address}` : '/messages/');
  };

  return (
    <div onClick={() => onConversationSelected(profile.ownedBy)}>
      <div className="flex justify-between pb-4 space-x-1.5">
        <UserProfile profile={profile} showHandle={false} messagePreview={message.content} />
        {message.sent && (
          <span className="text-xs text-gray-500">{dayjs(new Date(message.sent)).fromNow()}</span>
        )}
      </div>
    </div>
  );
};

export default Preview;
