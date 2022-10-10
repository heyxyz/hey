import UserProfile from '@components/Shared/UserProfile';
import { Profile } from '@generated/types';
import { Message } from '@xmtp/xmtp-js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

dayjs.extend(relativeTime);

interface Props {
  profile: Profile;
  message: Message;
}

const MessagePreview: FC<Props> = ({ profile, message }) => {
  const router = useRouter();

  console.log('preview alert');

  // TODO(elise): I think we'll want to update this route to use lens handle instead of eth address.
  const onConversationSelected = (address: string) => {
    router.push(address ? `/messages/${address}` : '/messages/');
  };

  return (
    <div onClick={() => onConversationSelected(profile.ownedBy)}>
      <div className="flex justify-between pb-4 space-x-1.5">
        <span onClick={(event) => event.stopPropagation()}>{<UserProfile profile={profile} />}</span>
        {message.sent && (
          <span className="text-xs text-gray-500">{dayjs(new Date(message.sent)).fromNow()}</span>
        )}
      </div>
    </div>
  );
};

export default MessagePreview;
