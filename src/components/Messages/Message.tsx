import MessageHeader from '@components/Shared/MessageHeader';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridLayout } from '@components/UI/GridLayout';
import useGetMessages from '@components/utils/hooks/useGetMessages';
import useMessagePreviews from '@components/utils/hooks/useMessagePreviews';
import useSendMessage from '@components/utils/hooks/useSendMessage';
import MetaTags from '@components/utils/MetaTags';
import isFeatureEnabled from '@lib/isFeatureEnabled';
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

const Message: FC = () => {
  const { query } = useRouter();
  const address = (query.address as string)?.toLowerCase();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const conversations = useMessageStore((state) => state.conversations);
  const selectedConversation = conversations.get(address);
  const [endTime, setEndTime] = useState<Map<string, Date>>(new Map());
  const { messages } = useGetMessages(
    selectedConversation,
    endTime.get(selectedConversation?.peerAddress ?? '')
  );
  const { sendMessage } = useSendMessage(selectedConversation);
  const { profiles } = useMessagePreviews();
  const profile = profiles.get(address);

  const fetchNextMessages = useCallback(() => {
    if (selectedConversation?.peerAddress) {
      const currentMessages = messages.get(selectedConversation?.peerAddress);
      if (Array.isArray(currentMessages) && currentMessages?.length > 0) {
        const lastMsgDate = currentMessages[currentMessages?.length - 1].sent;
        if (lastMsgDate instanceof Date && isFinite(lastMsgDate.getTime())) {
          endTime.set(selectedConversation.peerAddress, lastMsgDate);
          setEndTime(new Map(endTime));
        }
      }
    }
  }, [endTime, messages, selectedConversation?.peerAddress]);

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Message • ${APP_NAME}`} />
      <PreviewList />
      <GridItemEight>
        <Card className="h-[86vh]">
          <MessageHeader profile={profile} />
          <MessagesList
            currentProfile={currentProfile}
            profile={profile}
            fetchNextMessages={fetchNextMessages}
            messages={messages.get(address) ?? []}
          />
          <Composer sendMessage={sendMessage} />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Message;
