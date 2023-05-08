import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import useFetchLensProfiles from '@components/utils/hooks/push/useFetchLensProfiles';
import useGetChatProfile from '@components/utils/hooks/push/useGetChatProfile';
import { t } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { Profile } from 'lens';
import { useProfileLazyQuery } from 'lens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import type { ChatTypes } from 'src/store/push-chat';
import { CHAT_TYPES, usePushChatStore } from 'src/store/push-chat';
import { Card, GridItemEight, GridLayout } from 'ui';

import PreviewList from '../PreviewList';
import { getCAIPFromLensID, getIsHandle, getProfileFromDID } from './helper';
import MessageBody from './MessageBody';
import MessageHeader from './MessageHeader';

type MessagePropType = {
  conversationType: ChatTypes;
  conversationId: string;
};

const Message = ({ conversationType, conversationId }: MessagePropType) => {
  const [showLoading, setShowLoading] = useState(false);
  const { fetchChatProfile } = useGetChatProfile();
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const { loadLensProfiles } = useFetchLensProfiles();
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);
  const setSelectedChatId = usePushChatStore((state) => state.setSelectedChatId);
  const setSelectedChatType = usePushChatStore((state) => state.setSelectedChatType);
  const [getProfileByHandle, { loading }] = useProfileLazyQuery();

  const [profile, setProfile] = useState<Profile | null | ''>('');

  const setChatId = async (lensProfile: Profile | null) => {
    if (lensProfile && getProfileFromDID(selectedChatId) !== lensProfile.id) {
      const chatProfile = await fetchChatProfile({
        profileId: lensProfile.id
      });
      if (chatProfile) {
        setSelectedChatId(chatProfile.did);
      } else {
        setSelectedChatId(getCAIPFromLensID(lensProfile.id));
      }
    }
  };

  const loadChatProfile = useCallback(async () => {
    // only for chat profiles
    try {
      setShowLoading(true);
      if (getIsHandle(conversationId)) {
        getProfileByHandle({
          variables: { request: { handle: conversationId } },
          onCompleted: ({ profile }) => {
            if (profile) {
              setChatId(profile as Profile);
              setProfile(profile as Profile);
            }
          }
        });
      } else {
        const lensProfile = lensProfiles.get(conversationId);
        if (lensProfile) {
          setChatId(lensProfile as Profile);
          setProfile(lensProfile);
        } else {
          const result = await loadLensProfiles([conversationId]);
          const lensProfile = result?.get(conversationId);
          if (lensProfile) {
            setChatId(lensProfile as Profile);
            setProfile(lensProfile as Profile);
          } else {
            setChatId(null);
            setProfile(null);
          }
        }
      }
      setSelectedChatType(CHAT_TYPES.CHAT);
    } finally {
      setShowLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, lensProfiles, selectedChatId]);

  const loadGroupProfile = useCallback(async () => {
    // fetch group info and set profile
  }, [conversationId]);

  useEffect(() => {
    if (conversationType === CHAT_TYPES.CHAT) {
      loadChatProfile();
    } else if (conversationType === CHAT_TYPES.GROUP) {
      loadGroupProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
