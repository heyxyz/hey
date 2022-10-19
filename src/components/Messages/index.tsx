import Search from '@components/Shared/Navbar/Search';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridLayout } from '@components/UI/GridLayout';
import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import MetaTags from '@components/utils/MetaTags';
import type { Profile } from '@generated/types';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

import PreviewList from './PreviewList';

const Messages: FC = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const setMessageProfiles = useMessageStore((state) => state.setMessageProfiles);
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const [error, setError] = useState<string>('');
  const { client } = useXmtpClient();

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  const onProfileSelected = async (profile: Profile) => {
    if (!client) {
      return;
    }
    const peerAddress = profile.ownedBy;
    const isMessagesEnabled = await client?.canMessage(peerAddress);
    if (!isMessagesEnabled) {
      setError('Selected Lens Profile is not on XMTP');
      return;
    }
    messageProfiles.set(peerAddress.toLowerCase(), profile);
    setMessageProfiles(new Map(messageProfiles));
    const newConvo = await client?.conversations?.newConversation(peerAddress);
    conversations.set(peerAddress.toLowerCase(), newConvo);
    setConversations(new Map(conversations));
    router.push(`/messages/${profile.id}`);
    setError('');
  };

  return (
    <GridLayout>
      <MetaTags title={`Messages • ${APP_NAME}`} />
      <PreviewList />
      <GridItemEight>
        <Card className="h-[86vh]">
          <div className="w-full p-4">
            <Search isParentMessage={true} onProfileSelected={onProfileSelected} />
            {error ? (
              <div className="text-sm font-medium text-red-800 dark:text-red-200 pt-2">{error}</div>
            ) : (
              <div className="text-sm font-medium pt-2">Select a Lens Profile to Message</div>
            )}
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
