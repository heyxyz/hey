import Search from '@components/Shared/Navbar/Search';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import type { Profile } from '@generated/types';
import buildConversationId from '@lib/buildConversationId';
import { buildConversationKey } from '@lib/conversationKey';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { useRouter } from 'next/router';
import type { FC } from 'react';
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

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  const onProfileSelected = (profile: Profile) => {
    if (!currentProfile) {
      return;
    }
    const conversationId = buildConversationId(currentProfile.id, profile.id);
    const conversationKey = buildConversationKey(profile.ownedBy, conversationId);
    messageProfiles.set(conversationKey, profile);
    setMessageProfiles(new Map(messageProfiles));
    router.push(`/messages/${conversationKey}`);
  };

  return (
    <GridLayout>
      <MetaTags title={`Messages • ${APP_NAME}`} />
      <PreviewList />
      <GridItemEight>
        <Card className="h-[86vh]">
          <div className="w-full p-4">
            <Search
              placeholder="Search for a profile to message..."
              isParentMessage={true}
              onProfileSelected={onProfileSelected}
            />
          </div>
          <div className="flex items-center justify-center pb-4 h-full">
            <span className="text-gray-300 text-sm font-bold">No conversation selected</span>
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
