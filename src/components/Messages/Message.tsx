import { useQuery } from '@apollo/client';
import Composer from '@components/Messages/Composer';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridLayout } from '@components/UI/GridLayout';
import useGetMessages from '@components/utils/hooks/useGetMessages';
import useSendMessage from '@components/utils/hooks/useSendMessage';
import MetaTags from '@components/utils/MetaTags';
import { ProfileDocument } from '@generated/types';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

import MessagesList from './MessagesList';
import PreviewList from './PreviewList';

const Message: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const {
    query: { profileId }
  } = useRouter();

  const { data, loading, error } = useQuery(ProfileDocument, {
    variables: { request: { profileId: profileId }, who: currentProfile?.id ?? null },
    skip: !profileId
  });

  const address = data?.profile?.ownedBy?.toLowerCase();
  const conversations = useMessageStore((state) => state.conversations);
  const selectedConversation = conversations.get(address);
  const { messages } = useGetMessages(selectedConversation);
  const { sendMessage } = useSendMessage(selectedConversation);

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  if (!loading && !address) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Message • ${APP_NAME}`} />
      <PreviewList />
      <GridItemEight>
        <Card className="h-[86vh]">
          <div className="flex justify-center flex-1 p-5 border-b-[1px]">Header</div>
          <div className="h-[82%] overflow-y-auto">
            <MessagesList messages={messages.get(address) ?? []} />
          </div>
          <Composer sendMessage={sendMessage} />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Message;
