import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import useFetchChat from '@components/utils/hooks/push/useFetchChat';
import useFetchLensProfiles from '@components/utils/hooks/push/useFetchLensProfiles';
import useGetChatProfile from '@components/utils/hooks/push/useGetChatProfile';
import useGetGroup from '@components/utils/hooks/push/useGetGroup';
import useGroupByName from '@components/utils/hooks/push/useGetGroupbyName';
import { Growthbook } from '@lib/growthbook';
import { t } from '@lingui/macro';
import type { GroupDTO, IFeeds } from '@pushprotocol/restapi';
import { FeatureFlag } from 'data';
import { APP_NAME } from 'data/constants';
import type { Profile } from 'lens';
import { useProfileLazyQuery } from 'lens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import type { ChatTypes } from 'src/store/push-chat';
import { CHAT_TYPES, usePushChatStore } from 'src/store/push-chat';
import { Card, GridItemEight, GridLayout } from 'ui';

import PreviewList from '../PreviewList';
import { getCAIPFromLensID, getIsHandle, getProfileFromDID } from './helper';
import MessageBody from './MessageBody';
import MessageHeader from './MessageHeader';
import PUSHNoConversationSelected from './PUSHNoConversationSelected';

const { on: isPushDMsEnabled } = Growthbook.feature(FeatureFlag.PushDMs);

type MessagePropType = {
  conversationType: ChatTypes;
  conversationId: string;
};

const Message = ({ conversationType, conversationId }: MessagePropType) => {
  const [showLoading, setShowLoading] = useState(false);
  const { fetchChatProfile } = useGetChatProfile();
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const { loadLensProfiles, getLensProfile } = useFetchLensProfiles();
  const { fetchGroup } = useGetGroup();
  const { fetchGroupByName } = useGroupByName();
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);
  const setSelectedChatId = usePushChatStore(
    (state) => state.setSelectedChatId
  );
  const setSelectedChatType = usePushChatStore(
    (state) => state.setSelectedChatType
  );
  const [getProfileByHandle, { loading }] = useProfileLazyQuery();
  const { fetchChat } = useFetchChat();
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const chatsFeed = usePushChatStore((state) => state.chatsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const [profile, setProfile] = useState<Profile | null | ''>('');
  const [groupInfo, setGroupInfo] = useState<GroupDTO | null | ''>('');
  const [selectedChat, setSelectedChat] = useState<IFeeds>();

  useEffect(() => {
    if (!selectedChatId) {
      return;
    }
    const fetchSelectedChat = async () => {
      const response = await fetchChat({ recipientAddress: selectedChatId });
      setSelectedChat(response);
    };

    fetchSelectedChat();
  }, [selectedChatId, decryptedPgpPvtKey]);

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
          onCompleted: async ({ profile }) => {
            if (profile) {
              setChatId(profile as Profile);
              setProfile(profile as Profile);
              await getLensProfile(profile.id);
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
    try {
      setShowLoading(true);
      const [result1, result2] = await Promise.allSettled([
        fetchGroup({ chatId: conversationId }),
        fetchGroupByName({ name: conversationId })
      ]);

      if (result1.status === 'fulfilled' && result2.status === 'fulfilled') {
        // Case 1: Both promises are fulfilled
        const response = result1.value ?? result2.value;
        if (response) {
          setGroupInfo(response as GroupDTO);
          setSelectedChatId(response?.chatId);
        }
      } else if (result1.status === 'fulfilled') {
        // Case 2: Only the first promise is fulfilled
        const response = result1.value;
        if (response) {
          setGroupInfo(response as GroupDTO);
          setSelectedChatId(response?.chatId);
        }
      } else if (result2.status === 'fulfilled') {
        // Case 3: Only the second promise is fulfilled
        const response = result2.value;
        if (response) {
          setGroupInfo(response as GroupDTO);
          setSelectedChatId(response?.chatId);
        }
      } else {
        // Case 4: Both promises are rejected
        throw result1.reason;
      }
      setSelectedChatType(CHAT_TYPES.GROUP);
    } catch (error: Error | any) {
      // console.log(error);
      setGroupInfo(null);
    } finally {
      setShowLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationType === CHAT_TYPES.CHAT) {
      setGroupInfo('');
      loadChatProfile();
    } else if (conversationType === CHAT_TYPES.GROUP) {
      setProfile('');
      loadGroupProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, conversationType]);

  const CHAT_NOT_FOUND = profile === null || groupInfo === null;

  if (CHAT_NOT_FOUND) {
    toast.error('Chat Not Found!');
  }

  return (
    <GridLayout classNameChild="md:gap-8">
      <MetaTags title={APP_NAME} />
      <PreviewList className="xs:hidden sm:hidden md:hidden lg:block" />
      <GridItemEight className="xs:h-[85vh] xs:mx-2 mb-0 sm:mx-2 sm:h-[76vh] md:col-span-8 md:h-[80vh] xl:h-[84vh]">
        {CHAT_NOT_FOUND ? (
          <Card className="h-full">
            <div className="flex h-full flex-col text-center">
              <PUSHNoConversationSelected />
            </div>
          </Card>
        ) : (
          <Card className="flex h-full flex-col justify-between">
            {showLoading || loading ? (
              <div className="flex h-full flex-grow items-center justify-center">
                <Loader message={t`Loading messages`} />
              </div>
            ) : (
              <>
                {profile !== '' && profile && (
                  <>
                    <MessageHeader
                      profile={profile}
                      selectedChat={
                        chatsFeed[selectedChatId] ??
                        requestsFeed[selectedChatId] ??
                        selectedChat
                      }
                    />
                    <MessageBody
                      selectedChat={
                        chatsFeed[selectedChatId] ??
                        requestsFeed[selectedChatId] ??
                        selectedChat
                      }
                    />
                  </>
                )}
                {groupInfo !== '' && groupInfo && (
                  <>
                    <MessageHeader
                      groupInfo={groupInfo}
                      selectedChat={
                        chatsFeed[selectedChatId] ??
                        requestsFeed[selectedChatId] ??
                        selectedChat
                      }
                    />
                    <MessageBody
                      groupInfo={groupInfo}
                      selectedChat={
                        chatsFeed[selectedChatId] ??
                        requestsFeed[selectedChatId] ??
                        selectedChat
                      }
                    />
                  </>
                )}
              </>
            )}
          </Card>
        )}
      </GridItemEight>
    </GridLayout>
  );
};

const MessagePage: NextPage = () => {
  const currentProfileId = useAppStore((state) => state.currentProfile?.id);

  const {
    query: { conversationKey }
  } = useRouter();

  if (
    !conversationKey ||
    !currentProfileId ||
    !Array.isArray(conversationKey) ||
    !isPushDMsEnabled
  ) {
    return <Custom404 />;
  }

  //case where type is not given
  const [conversationType, conversationId] = conversationKey;

  if (
    conversationType !== CHAT_TYPES.CHAT &&
    conversationType !== CHAT_TYPES.GROUP
  ) {
    return <Custom404 />;
  }

  return (
    <Message
      conversationType={conversationType}
      conversationId={conversationId}
    />
  );
};

export default MessagePage;
