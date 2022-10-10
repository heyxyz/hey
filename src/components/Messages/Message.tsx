import Preview from '@components/Messages/Preview';
import MessageComposer from '@components/Shared/MessageComposer';
import MessagesList from '@components/Shared/MessagesList';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import useGetMessages from '@components/utils/hooks/useGetMessages';
import useSendMessage from '@components/utils/hooks/useSendMessage';
import MetaTags from '@components/utils/MetaTags';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

const Message: FC = () => {
  const { query } = useRouter();
  const address = query.address as string;
  const currentProfile = useAppStore((state) => state.currentProfile);
  const conversations = useMessageStore((state) => state.conversations);
  const selectedConversation = conversations.get(address);
  const messagePreviews = useMessageStore((state) => state.messagePreviews);
  const { messages } = useGetMessages(selectedConversation);
  const { sendMessage } = useSendMessage(selectedConversation);

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Message • ${APP_NAME}`} />
      <GridItemFour>
        <Card className="h-[86vh] px-2 pt-3">
          <div className="flex justify-between">
            <div className="font-black text-lg">Messages</div>
            <div>
              <button className="text-xs border border-p-100 p-1 rounded">New Message</button>
            </div>
          </div>
          <div className="flex justify-between p-4">
            <div className="text-xs">Lens profiles</div>
            <div className="text-xs">All messages</div>
          </div>
          <div>
            {Array.from(messagePreviews.values()).map((messagePreview, index) => {
              if (!messagePreview.profile || !messagePreview.message) {
                return null;
              }
              return (
                <Preview
                  key={`${messagePreview.profile.ownedBy}_${index}`}
                  profile={messagePreview.profile}
                  message={messagePreview.message}
                />
              );
            })}
          </div>
        </Card>
      </GridItemFour>
      <GridItemEight>
        <Card className="h-[86vh]">
          <div className="flex justify-center flex-1 p-5 border-b-[1px]">Header</div>
          <div className="h-[82%] overflow-y-auto">
            <MessagesList messages={messages.get(address) ?? []} />
          </div>
          <MessageComposer sendMessage={sendMessage} />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Message;
