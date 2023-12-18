import { PUSH_ENV } from '@hey/data/constants';
import formatAddress from '@hey/lib/formatAddress';
import {
  Button,
  GridItemEight,
  GridItemFour,
  GridLayout,
  Image
} from '@hey/ui';
import { chat } from '@pushprotocol/restapi';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import useMessageStore from 'src/store/persisted/useMessageStore';
import { useWalletClient } from 'wagmi';

import ChatListItemContainer from './ChatContainer';
import { ChatShimmer } from './ChatShimmer';

const ChatView = () => {
  const [selectedProfile, setSelectedProfile] = useState<any>();

  const pgpPvtKey = useMessageStore((state) => state.pgpPvtKey);
  const { data: signer } = useWalletClient();

  const baseConfig = useMemo(() => {
    return {
      account: signer?.account.address ?? '',
      env: PUSH_ENV,
      pgpPrivateKey: pgpPvtKey
    };
  }, [signer, pgpPvtKey]);

  const { data: chats, isLoading: fetchingChats } = useQuery({
    enabled: !!signer?.account,
    queryFn: async () => {
      return await chat.chats(baseConfig);
    },
    queryKey: ['get-chats']
  });

  const { data: requests, isLoading: fetchingRequests } = useQuery({
    enabled: !!signer?.account,
    queryFn: async () => {
      return await chat.requests(baseConfig);
    },
    queryKey: ['get-pending-requests']
  });

  const isChatsLoading = fetchingRequests || fetchingChats;

  const allChats = useMemo(() => {
    if (isChatsLoading) {
      return [];
    }

    if (!chats || !requests) {
      return [];
    }

    const requestChats = requests?.map((item) => ({
      ...item,
      type: 'request'
    }));
    const normalChats = chats?.map((item) => ({
      ...item,
      type: 'chat'
    }));
    return [...normalChats, ...requestChats];
  }, [chats, isChatsLoading, requests]);

  console.log('>>> isCha', isChatsLoading, allChats);
  if (!isChatsLoading && allChats.length === 0) {
    return (
      <div className="min-w-screen-xl container m-auto flex min-h-[-webkit-calc(100vh-65px)] flex-col items-center justify-center bg-white">
        <h2 className="text-2xl">Didn't chat yet!</h2>
        <p className="text-sm text-gray-500">
          Looks like you haven't started any conversation
        </p>
        <Button className="my-4" size="lg">
          New message
        </Button>
      </div>
    );
  }

  return (
    <GridLayout
      className="border-x-[1px] bg-white p-0 sm:p-0"
      classNameChild="lg:gap-0"
    >
      <GridItemFour className="border-r">
        {isChatsLoading ? (
          <ChatShimmer />
        ) : (
          <>
            {allChats.map((chat) => {
              const profile = {
                address: chat.wallets?.split(':').pop() ?? '',
                did: chat.wallets,
                handle: chat.name,
                isRequestProfile: chat.type === 'request',
                threadhash: chat.threadhash
              };
              return (
                <div
                  className="mb-2 cursor-pointer p-4"
                  key={chat.chatId}
                  onClick={() => {
                    setSelectedProfile(profile);
                  }}
                >
                  <div className="flex">
                    <Image
                      alt={chat.chatId}
                      className="mr-2 h-8 w-8 cursor-pointer rounded-full border dark:border-gray-700"
                      src={chat.profilePicture ?? ''}
                    />
                    <div key={chat.chatId}>
                      <p>
                        {chat.name
                          ? chat.name
                          : formatAddress(chat.wallets.split(':').pop() ?? '')}
                      </p>
                      <p>{chat.msg.messageType}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </GridItemFour>
      <GridItemEight>
        {selectedProfile ? (
          <ChatListItemContainer profile={selectedProfile} />
        ) : (
          <div className="flex min-h-[-webkit-calc(100vh-90px)] flex-col items-center justify-center">
            <h2 className="text-2xl">Select a message</h2>
            <p className="text-sm text-gray-500">
              Choose from your existing conversations, start a new one, or just
              keep swimming.
            </p>
            <Button className="my-4" size="lg">
              New message
            </Button>
          </div>
        )}
      </GridItemEight>
    </GridLayout>
  );
};

export default ChatView;
