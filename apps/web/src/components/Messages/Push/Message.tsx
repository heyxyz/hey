import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import { t } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { Profile } from 'lens';
import { useProfileLazyQuery, useProfilesLazyQuery } from 'lens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import type { ChatTypes } from 'src/store/push-chat';
import { CHAT_TYPES, usePushChatStore } from 'src/store/push-chat';
import { Card, GridItemEight, GridLayout } from 'ui';

import PreviewList from '../PreviewList';
import { getIsHandle } from './helper';
import MessageBody from './MessageBody';
import MessageHeader from './MessageHeader';

type MessagePropType = {
  conversationType: ChatTypes;
  conversationId: string;
};

const Message = ({ conversationType, conversationId }: MessagePropType) => {
  const [showLoading, setShowLoading] = useState(false);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const selectedChatType = usePushChatStore((state) => state.selectedChatType);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);
  const setSelectedChatId = usePushChatStore((state) => state.setSelectedChatId);
  const setSelectedChatType = usePushChatStore((state) => state.setSelectedChatType);
  const [getProfileByHandle, { loading }] = useProfileLazyQuery();

  const [loadProfiles] = useProfilesLazyQuery();
  const [profile, setProfile] = useState<Profile | null | ''>('');

  const loadProfile = useCallback(async () => {
    // only for chat for now, for groups, it'll change
    try {
      setShowLoading(true);
      if (getIsHandle(conversationId)) {
        getProfileByHandle({
          variables: { request: { handle: conversationId } },
          onCompleted: ({ profile }) => {
            if (profile) {
              setProfile(profile as Profile);
              setSelectedChatId(profile.id);
            }
          }
        });
      } else {
        const lensProfile = lensProfiles.get(conversationId);
        if (lensProfile) {
          setProfile(lensProfile);
        } else {
          const result = await loadProfiles({ variables: { request: { profileIds: [conversationId] } } });
          if (result.data) {
            setProfile(result.data.profiles.items[0] as Profile);
          } else {
            setProfile(null);
          }
        }
        setSelectedChatId(conversationId);
      }
      setSelectedChatType(conversationType);
    } finally {
      setShowLoading(false);
    }
  }, [loadProfiles, conversationId, conversationType]);

  useEffect(() => {
    loadProfile();
  }, [conversationId, conversationType]);

  if (profile === null) {
    return <Custom404 />;
  }

  return (
    <GridLayout classNameChild="md:gap-8">
      <MetaTags title={APP_NAME} />
      <PreviewList className="xs:hidden sm:hidden md:hidden lg:block" />
      <GridItemEight className="xs:h-[85vh] xs:mx-2 mb-0 sm:mx-2 sm:h-[76vh] md:col-span-8 md:h-[80vh] xl:h-[84vh]">
        <Card className="flex h-full flex-col justify-between">
          {showLoading || loading ? (
            <div className="flex h-full flex-grow items-center justify-center">
              <Loader message={t`Loading messages`} />
            </div>
          ) : (
            profile && (
              <>
                <MessageHeader profile={profile as Profile} />
                <MessageBody />
              </>
            )
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

const MessagePage: NextPage = () => {
  const currentProfileId = useAppStore((state) => state.currentProfile?.id);

  const {
    query: { conversationKey }
  } = useRouter();

  if (!conversationKey || !currentProfileId || !Array.isArray(conversationKey)) {
    return <Custom404 />;
  }

  //case where type is not given
  const [conversationType, conversationId] = conversationKey;

  if (conversationType !== CHAT_TYPES.CHAT && conversationType !== CHAT_TYPES.GROUP) {
    return <Custom404 />;
  }

  return <Message conversationType={conversationType} conversationId={conversationId} />;
};

export default MessagePage;
