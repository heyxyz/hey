import Loader from '@components/Shared/Loader';
import Search from '@components/Shared/Navbar/Search';
import { PUSH_ENV } from '@hey/data/constants';
import formatAddress from '@hey/lib/formatAddress';
import { Card, GridItemEight, GridItemFour, GridLayout, Image } from '@hey/ui';
import { chat } from '@pushprotocol/restapi';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import useMessageStore from 'src/store/persisted/useMessageStore';
import { useWalletClient } from 'wagmi';

import ChatListItemContainer from './ChatContainer';

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

  const allChats = useMemo(() => {
    if (fetchingRequests || fetchingChats) {
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
  }, [chats, fetchingChats, fetchingRequests, requests]);

  console.log(allChats, 'chats...');

  return (
    <GridLayout className="h-80">
      <GridItemFour className="h-80">
        <Card className="max-h-full min-h-[800px] p-4">
          <Search
            onProfileSelected={async (profile) => {
              // const newChat = await user
              const _profile = {
                address: profile.ownedBy.address,
                name: profile.handle?.localName
              };
              setSelectedProfile(_profile);
            }}
            placeholder="Search..."
          />
          {fetchingChats || fetchingRequests ? (
            <Loader message="Fetching chats..." />
          ) : (
            <>
              <div className="mt-4">
                {chats?.length === 0 && requests?.length === 0 && (
                  <p>No Chats found...</p>
                )}
              </div>
              {allChats.map((chat) => {
                const profile = {
                  address: chat.wallets?.split(':').pop() ?? '',
                  did: chat.wallets,
                  handle: chat.name,
                  isRequestProfile: chat.type === 'request',
                  threadhash: chat.threadhash
                };
                return (
                  <Card
                    className="mb-2 cursor-pointer p-2"
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
                            : formatAddress(
                                chat.wallets.split(':').pop() ?? ''
                              )}
                        </p>
                        <p>{chat.msg.messageType}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}
        </Card>
      </GridItemFour>
      <GridItemEight>
        <Card className="mx-4 max-h-full min-h-[800px] p-4">
          {selectedProfile && (
            <ChatListItemContainer profile={selectedProfile} />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default ChatView;
