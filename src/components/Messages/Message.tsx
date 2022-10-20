import { useQuery } from '@apollo/client';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridLayout } from '@components/UI/GridLayout';
import { PageLoading } from '@components/UI/PageLoading';
import useGetMessages from '@components/utils/hooks/useGetMessages';
import useMessagePreviews from '@components/utils/hooks/useMessagePreviews';
import useSendMessage from '@components/utils/hooks/useSendMessage';
import useStreamMessages from '@components/utils/hooks/useStreamMessages';
import MetaTags from '@components/utils/MetaTags';
import type { Profile } from '@generated/types';
import { ProfileDocument } from '@generated/types';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

import Composer from './Composer';
import MessageHeader from './MessageHeader';
import MessagesList from './MessagesList';
import PreviewList from './PreviewList';

const Message: FC = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const client = useMessageStore((state) => state.client);
  const profileId = router.query.profileId;

  const { data, loading, error } = useQuery(ProfileDocument, {
    variables: { request: { profileId: profileId }, who: currentProfile?.id ?? null },
    skip: !profileId
  });

  const peerProfile = data?.profile as Profile;
  const peerAddress = peerProfile?.ownedBy?.toLowerCase();
  const conversations = useMessageStore((state) => state.conversations);
  const selectedConversation = conversations.get(peerAddress);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const setMessageProfiles = useMessageStore((state) => state.setMessageProfiles);
  const setConversations = useMessageStore((state) => state.setConversations);
  const [endTime, setEndTime] = useState<Map<string, Date>>(new Map());
  const { messages, hasMore } = useGetMessages(selectedConversation, endTime.get(peerAddress ?? ''));
  useStreamMessages(selectedConversation);
  const { sendMessage } = useSendMessage(selectedConversation);
  const { profiles } = useMessagePreviews();
  const profile = profiles.get(peerAddress);

  const fetchNextMessages = useCallback(async () => {
    if (peerAddress && hasMore) {
      const currentMessages = messages.get(peerAddress);
      if (Array.isArray(currentMessages) && currentMessages?.length > 0) {
        const lastMsgDate = currentMessages[currentMessages?.length - 1].sent;
        if (
          lastMsgDate instanceof Date &&
          isFinite(lastMsgDate.getTime()) &&
          lastMsgDate !== endTime.get(peerAddress)
        ) {
          endTime.set(peerAddress, lastMsgDate);
          setEndTime(new Map(endTime));
        }
      }
    }
  }, [peerAddress, hasMore, messages, endTime]);

  const showLoading = !profile || !currentProfile || !peerAddress || !selectedConversation;

  useEffect(() => {
    const updateStateOnRoute = async () => {
      if (peerProfile && !messageProfiles.has(peerAddress) && client) {
        const isMessagesEnabled = await client?.canMessage(peerProfile.ownedBy);
        if (!isMessagesEnabled) {
          router.push('/messages');
          return;
        }
        messageProfiles.set(peerAddress, peerProfile);
        setMessageProfiles(new Map(messageProfiles));
        const newConvo = await client.conversations?.newConversation(peerProfile.ownedBy);
        conversations.set(peerAddress, newConvo);
        setConversations(new Map(conversations));
      }
    };
    updateStateOnRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, peerAddress, client]);

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  if (!loading && !peerAddress) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Message • ${APP_NAME}`} />
      <PreviewList />
      <GridItemEight>
        <Card className="h-[86vh] flex justify-between flex-col">
          {showLoading ? (
            <PageLoading message="Loading messages" />
          ) : (
            <>
              <MessageHeader profile={profile} />
              <MessagesList
                currentProfile={currentProfile}
                profile={profile}
                fetchNextMessages={fetchNextMessages}
                messages={messages.get(peerAddress) ?? []}
                hasMore={hasMore}
              />
              <Composer sendMessage={sendMessage} />
            </>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Message;
