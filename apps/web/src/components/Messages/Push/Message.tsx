import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import { t } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { Profile } from 'lens';
import { useProfilesLazyQuery } from 'lens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { CHAT_TYPES, usePushChatStore } from 'src/store/push-chat';
import { Card, GridItemEight, GridLayout } from 'ui';

import PreviewList from '../PreviewList';
import MessageBody from './MessageBody';
import MessageHeader from './MessageHeader';

const Message = () => {
  const [showLoading, setShowLoading] = useState(false);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const [loadProfiles] = useProfilesLazyQuery();
  const [profile, setProfile] = useState<Profile | null | ''>('');

  const loadProfile = useCallback(async () => {
    // only for chat for now, for groups, it'll change
    const result = await loadProfiles({ variables: { request: { profileIds: [selectedChatId] } } });
    if (result.data) {
      setProfile(result.data.profiles.items[0] as Profile);
    } else {
      setProfile(null);
    }
  }, [loadProfiles, selectedChatId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile, selectedChatId]);

  if (profile === null) {
    return <Custom404 />;
  }

  return (
    <GridLayout classNameChild="md:gap-8">
      <MetaTags title={APP_NAME} />
      <PreviewList className="xs:hidden sm:hidden md:hidden lg:block" />
      <GridItemEight className="xs:h-[85vh] xs:mx-2 mb-0 sm:mx-2 sm:h-[76vh] md:col-span-8 md:h-[80vh] xl:h-[84vh]">
        <Card className="flex h-full flex-col justify-between">
          {showLoading ? (
            <div className="flex h-full flex-grow items-center justify-center">
              <Loader message={t`Loading messages`} />
            </div>
          ) : (
            profile && (
              <div className="h-full">
                <MessageHeader profile={profile as Profile} />
                <MessageBody />
              </div>
            )
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

const MessagePage: NextPage = () => {
  const currentProfileId = useAppStore((state) => state.currentProfile?.id);
  const setSelectedChatId = usePushChatStore((state) => state.setSelectedChatId);
  const setSelectedChatType = usePushChatStore((state) => state.setSelectedChatType);

  const {
    query: { conversationKey }
  } = useRouter();
  // useEffect(() => {
  //   Mixpanel.track(PAGEVIEW, { page: 'conversation' });
  // }, []);

  if (!conversationKey || !currentProfileId || !Array.isArray(conversationKey)) {
    return <Custom404 />;
  }

  //case where type is not given
  const [type, conversationId] = conversationKey;
  console.log(type, conversationId);

  if (type !== CHAT_TYPES.CHAT && type !== CHAT_TYPES.GROUP) {
    return <Custom404 />;
  }

  if (conversationId) {
    setSelectedChatId(conversationId);
    setSelectedChatType(type);
  }

  return <Message />;
};

export default MessagePage;
