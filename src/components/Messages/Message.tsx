import { useQuery } from '@apollo/client';
import MessageHeader from '@components/Messages/MessageHeader';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridLayout } from '@components/UI/GridLayout';
import { PageLoading } from '@components/UI/PageLoading';
import useGetMessages from '@components/utils/hooks/useGetMessages';
import useSendMessage from '@components/utils/hooks/useSendMessage';
import useStreamMessages from '@components/utils/hooks/useStreamMessages';
import MetaTags from '@components/utils/MetaTags';
import { ProfileAddressDocument } from '@generated/types';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

import Composer from './Composer';
import MessagesList from './MessagesList';
import PreviewList from './PreviewList';

const Message: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const {
    query: { profileId }
  } = useRouter();

  const { data, loading, error } = useQuery(ProfileAddressDocument, {
    variables: { request: { profileId: profileId } },
    skip: !profileId
  });

  const address = data?.profile?.ownedBy?.toLowerCase();
  const conversations = useMessageStore((state) => state.conversations);
  const selectedConversation = conversations.get(address);
  const [endTime, setEndTime] = useState<Map<string, Date>>(new Map());
  const { messages, hasMore } = useGetMessages(selectedConversation, endTime.get(address ?? ''));
  useStreamMessages(selectedConversation);
  const { sendMessage } = useSendMessage(selectedConversation);
  const profiles = useMessageStore((state) => state.messageProfiles);
  const profile = profiles.get(address);

  const fetchNextMessages = useCallback(async () => {
    if (address && hasMore) {
      const currentMessages = messages.get(address);
      if (Array.isArray(currentMessages) && currentMessages?.length > 0) {
        const lastMsgDate = currentMessages[currentMessages?.length - 1].sent;
        if (
          lastMsgDate instanceof Date &&
          isFinite(lastMsgDate.getTime()) &&
          lastMsgDate !== endTime.get(address)
        ) {
          endTime.set(address, lastMsgDate);
          setEndTime(new Map(endTime));
        }
      }
    }
  }, [address, hasMore, messages, endTime]);

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  if (!loading && !address) {
    return <Custom404 />;
  }

  const showLoading = !profile || !currentProfile || !address || !selectedConversation;

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
                messages={messages.get(address) ?? []}
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
