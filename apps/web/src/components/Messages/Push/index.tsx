import type { IMessageIPFSWithCID } from '@pushprotocol/restapi';

import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useEffect } from 'react';
import usePushSocket from 'src/hooks/messaging/push/usePushSocket';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import Composer from './Composer';
import Header from './Header';
import Messages from './Message';
import NoConversationSelected from './NoConversationSelected';
import Tabs from './Tabs';

const Message = () => {
  const recepientProfile = usePushChatStore((state) => state.recipientProfile);
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const recipientChats = usePushChatStore((state) => state.recipientChats);
  const pushSocket = usePushSocket();
  const initialConversation = requestsFeed?.find((item) =>
    item.did.includes(recepientProfile?.ownedBy?.address!)
  );

  useEffect(() => {
    pushSocket?.connect();
    return () => {
      pushSocket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout classNameChild="md:gap-3 lg:gap-3">
      <MetaTags title={`${APP_NAME} Messages`} />
      <GridItemFour
        className={
          'xs:h-[85vh] xs:mx-2 mb-0 sm:mx-2 sm:h-[76vh] md:col-span-4 md:h-[80vh] xl:h-[84vh]'
        }
      >
        <div className="flex h-full flex-col justify-between">
          <Tabs />
        </div>
      </GridItemFour>
      <GridItemEight className="xs:h-[85vh] xs:mx-2 mb-0 sm:mx-2 sm:h-[76vh] md:col-span-8 md:h-[80vh] xl:h-[84vh]">
        <Card className="flex h-full flex-col justify-between">
          {recepientProfile ? (
            <>
              <Header profile={recepientProfile!} />
              <Messages
                selectedChat={
                  initialConversation
                    ? [initialConversation.msg as IMessageIPFSWithCID]
                    : recipientChats
                }
              />
              <Composer />
            </>
          ) : (
            <NoConversationSelected />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Message;
