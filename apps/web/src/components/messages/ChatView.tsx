import SearchUser from '@components/Shared/SearchUser';
import { PUSH_ENV } from '@hey/data/constants';
import formatAddress from '@hey/lib/formatAddress';
import {
  Button,
  GridItemEight,
  GridItemFour,
  GridLayout,
  Image
} from '@hey/ui';
import { getLatestMessagePreviewText } from '@lib/getLatestMessagePreviewText';
import { chat, user } from '@pushprotocol/restapi';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { usePushStream } from 'src/hooks/usePushStream';
import useMessageStore from 'src/store/persisted/useMessageStore';
import { useAccount, useWalletClient } from 'wagmi';

import ChatListItemContainer from './ChatContainer';
import { ChatShimmer } from './ChatShimmer';

const ChatView = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<any>();

  const pgpPvtKey = useMessageStore((state) => state.pgpPvtKey);
  const { data: signer } = useWalletClient();

  // Helps to check if the wallet is enabled or not
  const { status } = useAccount();
  const { refresh } = useRouter();

  const baseConfig = useMemo(() => {
    return {
      account: signer?.account.address ?? '',
      env: PUSH_ENV,
      pgpPrivateKey: pgpPvtKey,
      toDecrypt: true
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
    return (
      [...normalChats, ...requestChats]
        // Filtering groups out
        .filter((each) => !each.groupInformation)
    );
  }, [chats, isChatsLoading, requests]);

  const callback = useCallback((args: any) => {
    console.log(args, 'args..');
  }, []);

  const stream = usePushStream({
    account: signer?.account.address as string,
    autoConnect: true,
    callback
  });

  console.log(stream, 'stream..');

  if (status !== 'connected') {
    return (
      <div className="page-center flex flex-col">
        <h2 className="text-2xl">Your wallet is not connected!</h2>
        <p className="my-2 text-sm">
          Please unlock your wallet and refresh the page
        </p>
        <Button onClick={refresh}>Refresh</Button>
      </div>
    );
  }

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
            <div className="p-2">
              <SearchUser
                onChange={(event) => setSearchValue(event.target.value)}
                onProfileSelected={async (profile) => {
                  const userProfile = await user.get({
                    account: profile.ownedBy.address
                  });

                  setSelectedProfile({
                    address: userProfile.wallets?.split(':').pop() ?? '',
                    did: userProfile.wallets,
                    handle: userProfile.name,
                    isRequestProfile: false
                  });
                }}
                placeholder="Search profiles..."
                value={searchValue}
              />
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
                <div
                  className="mb-2 cursor-pointer p-4"
                  key={chat.chatId}
                  onClick={() => {
                    if (
                      !selectedProfile ||
                      selectedProfile.address !== profile.address
                    ) {
                      setSelectedProfile(profile);
                    }
                  }}
                >
                  <div className="flex">
                    <Image
                      alt={chat.chatId}
                      className="mr-2 h-10 w-10 cursor-pointer rounded-full border dark:border-gray-700"
                      src={chat.profilePicture ?? ''}
                    />
                    <div className="w-3/4" key={chat.chatId}>
                      <p>
                        {chat.name
                          ? chat.name
                          : formatAddress(
                              chat?.wallets?.split?.(':')?.pop() ?? ''
                            )}
                      </p>
                      <p className="truncate text-sm text-gray-400">
                        {getLatestMessagePreviewText(chat.msg as any)}
                      </p>
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
