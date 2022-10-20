import MessageHeader from '@components/Messages/MessageHeader';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridLayout } from '@components/UI/GridLayout';
import { PageLoading } from '@components/UI/PageLoading';
import useGetMessages from '@components/utils/hooks/useGetMessages';
import useSendMessage from '@components/utils/hooks/useSendMessage';
import useStreamMessages from '@components/utils/hooks/useStreamMessages';
import MetaTags from '@components/utils/MetaTags';
import buildConversationId from '@lib/buildConversationId';
import { buildConversationKey, parseConversationKey } from '@lib/conversationKey';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Client } from '@xmtp/xmtp-js';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

import Composer from './Composer';
import MessagesList from './MessagesList';
import PreviewList from './PreviewList';

type MessageProps = {
  conversationKey: string;
  profileId: string;
};

const Message: FC<MessageProps> = ({ conversationKey }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const profile = messageProfiles.get(conversationKey);

  const selectedConversation = useMessageStore((state) => state.conversations.get(conversationKey));
  const [endTime, setEndTime] = useState<Map<string, Date>>(new Map());
  const { messages, hasMore } = useGetMessages(
    conversationKey,
    selectedConversation,
    endTime.get(conversationKey)
  );
  useStreamMessages(conversationKey, selectedConversation);
  const { sendMessage } = useSendMessage(selectedConversation);

  const fetchNextMessages = useCallback(async () => {
    if (hasMore && Array.isArray(messages) && messages.length > 0) {
      const lastMsgDate = messages[messages.length - 1].sent;
      const currentEndTime = endTime.get(conversationKey);
      if (!currentEndTime || lastMsgDate <= currentEndTime) {
        endTime.set(conversationKey, lastMsgDate);
        setEndTime(new Map(endTime));
      }
    }
  }, [conversationKey, hasMore, messages, endTime]);

  const client = useMessageStore((state) => state.client);
  const { push } = useRouter();
  const setMessageProfiles = useMessageStore((state) => state.setMessageProfiles);
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  useEffect(() => {
    const ensureConversation = async () => {
      if (!currentProfile || !profile || !client) {
        return;
      }
      const isMessagesEnabled = await Client?.canMessage(profile.ownedBy);
      if (!isMessagesEnabled) {
        push('/messages');
        return;
      }
      const conversationId = buildConversationId(currentProfile.id, profile.id);
      const conversationKey = buildConversationKey(profile.ownedBy, conversationId);
      const conversation = await client.conversations.newConversation(profile.ownedBy, {
        conversationId: conversationId,
        metadata: {}
      });
      messageProfiles.set(conversationKey, profile);
      setMessageProfiles(new Map(messageProfiles));
      conversations.set(conversationKey, conversation);
      setConversations(new Map(conversations));
    };
    ensureConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, client]);

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  const showLoading = !profile || !currentProfile || !selectedConversation;

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
                messages={messages ?? []}
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

const MessagePage: FC = () => {
  const currentProfileId = useAppStore((state) => state.currentProfile?.id);
  const {
    query: { conversationKey }
  } = useRouter();

  // Need to have a login page for when there is no currentProfileId
  if (!conversationKey || !currentProfileId || !Array.isArray(conversationKey)) {
    return <Custom404 />;
  }

  const joinedConversationKey = conversationKey.join('/');

  const parsed = parseConversationKey(joinedConversationKey);
  if (!parsed) {
    return <Custom404 />;
  }

  const { members } = parsed;

  const profileId = members.find((member) => member !== currentProfileId);
  if (!profileId) {
    return <Custom404 />;
  }

  return <Message conversationKey={joinedConversationKey} profileId={profileId} />;
};

export default MessagePage;
