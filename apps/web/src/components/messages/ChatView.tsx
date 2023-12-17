import type { PushAPI } from '@pushprotocol/restapi';

import Loader from '@components/Shared/Loader';
import Search from '@components/Shared/Navbar/Search';
import formatAddress from '@hey/lib/formatAddress';
import { Card, GridItemEight, GridItemFour, GridLayout, Image } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import ChatListItemContainer from './ChatContainer';

const ChatView = ({ user }: { user: PushAPI }) => {
  const [selectedProfile, setSelectedProfile] = useState<any>();

  const { data: chats, isLoading: fetchingChats } = useQuery({
    queryFn: async () => {
      return await user.chat.list('CHATS');
    },
    queryKey: ['get-chats']
  });

  const { data: requests, isLoading: fetchingRequests } = useQuery({
    queryFn: async () => {
      return await user.chat.list('REQUESTS');
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

  return (
    <GridLayout className="h-80">
      <GridItemFour className="h-80">
        <Card className="max-h-full min-h-[800px] p-4">
          <Search
            onProfileSelected={(profile) => {
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
                  address: chat.wallets.split(':').pop() ?? '',
                  did: chat.wallets,
                  handle: chat.name,
                  isRequestProfile: chat.type === 'request'
                };
                return (
                  <Card
                    className="cursor-pointer p-2"
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
        <Card className="ml-4 max-h-full min-h-[800px] p-4">
          {selectedProfile && (
            <ChatListItemContainer profile={selectedProfile} push={user} />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default ChatView;
