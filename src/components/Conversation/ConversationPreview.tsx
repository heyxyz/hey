import { Conversation } from '@xmtp/xmtp-js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

dayjs.extend(relativeTime);

interface Props {
  address: string;
  conversation: Conversation;
}

const ConversationPreview: FC<Props> = ({ address, conversation }) => {
  const router = useRouter();

  // const { data, loading } = useQuery(ProfileQueryRequest, {
  //   variables: { ownedBy: address },
  //   onCompleted: (data) => {
  //     const profiles = data?.profiles?.items;
  //     if (!profiles.length) {
  //       return;
  //     }

  //     const defaultProfile = profiles.find((profile) => profile.isDefault === true);
  //     const selectedProfile = defaultProfile || profiles[0];
  //     // TODO(elise): Update the profile!
  //   }
  // });

  const onConversationSelected = (address: string) => {
    router.push(address ? `/messages/${address}` : '/messages/');
  };

  return (
    <article className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer first:rounded-t-xl last:rounded-b-xl p-5">
      <div onClick={() => onConversationSelected(address)}>
        <div className="flex justify-between pb-4 space-x-1.5">
          <span onClick={(event) => event.stopPropagation()}>{/* <UserProfile profile={profile} /> */}</span>
          {/* TODO(elise): Add message preview text and timestamp. */}
          {/* <span className="text-xs text-gray-500">{dayjs(new Date(conversation)).fromNow()}</span> */}
        </div>
      </div>
    </article>
  );
};

export default ConversationPreview;
