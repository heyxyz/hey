import Search from '@components/Shared/Navbar/Search';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import type { Profile } from '@generated/types';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Client } from '@xmtp/xmtp-js';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

import PreviewList from './PreviewList';

const Messages: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const router = useRouter();
  const [error, setError] = useState<string>('');

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  const onProfileSelected = async (profile: Profile) => {
    const isMessagesEnabled = await Client.canMessage(profile?.ownedBy);
    if (isMessagesEnabled) {
      router.push(`/messages/${profile.id}`);
      setError('');
    } else {
      setError('Selected Lens Profile is not on XMTP');
    }
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
