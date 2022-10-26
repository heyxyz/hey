import MessageHeader from '@components/Messages/MessageHeader';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridLayout } from '@components/UI/GridLayout';
import { PageLoading } from '@components/UI/PageLoading';
import useGetConversation from '@components/utils/hooks/useGetConversation';
import useGetMessages from '@components/utils/hooks/useGetMessages';
import useSendMessage from '@components/utils/hooks/useSendMessage';
import useStreamMessages from '@components/utils/hooks/useStreamMessages';
import MetaTags from '@components/utils/MetaTags';
import { parseConversationKey } from '@lib/conversationKey';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

import Composer from './Composer';
import MessagesList from './MessagesList';
import PreviewList from './PreviewList';

interface MessageProps {
  conversationKey: string;
}

const Message: FC<MessageProps> = ({ conversationKey }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const profile = useMessageStore((state) => state.messageProfiles.get(conversationKey));
  const { selectedConversation, missingXmtpAuth } = useGetConversation(conversationKey, profile);
  const [endTime, setEndTime] = useState<Map<string, Date>>(new Map());
  const { messages, hasMore } = useGetMessages(
    conversationKey,
    selectedConversation,
    endTime.get(conversationKey)
  );
  useStreamMessages(conversationKey, selectedConversation);
  const { sendMessage } = useSendMessage(selectedConversation);

  const fetchNextMessages = useCallback(() => {
    if (hasMore && Array.isArray(messages) && messages.length > 0) {
      const lastMsgDate = messages[messages.length - 1].sent;
      const currentEndTime = endTime.get(conversationKey);
      if (!currentEndTime || lastMsgDate <= currentEndTime) {
        endTime.set(conversationKey, lastMsgDate);
        setEndTime(new Map(endTime));
      }
    }
  }, [conversationKey, hasMore, messages, endTime]);

  if (!currentProfile || !isFeatureEnabled('messages', currentProfile.id)) {
    return <Custom404 />;
  }

  const showLoading = !missingXmtpAuth && (!profile || !currentProfile || !selectedConversation);

  return (
    <GridLayout>
      {/* TODO: Show user profile name/username */}
      <MetaTags title={`Message • ${APP_NAME}`} />
      <PreviewList />
      <GridItemEight className="sm:h-[76vh] md:h-[80vh] xl:h-[84vh] mb-0">
        <Card className="h-full flex justify-between flex-col">
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
                missingXmtpAuth={missingXmtpAuth ?? false}
              />
              <Composer sendMessage={sendMessage} />
            </>
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

  return <Message conversationKey={joinedConversationKey} />;
};

export default MessagePage;
