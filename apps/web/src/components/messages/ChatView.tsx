import type { IMessageIPFS, IMessageIPFSWithCID } from '@pushprotocol/restapi';
import type { InfiniteData } from '@tanstack/react-query';

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
import { chat, EVENTS, user } from '@pushprotocol/restapi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
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

  // get-user-info and cache to decrypt later data.
  const { data: userInfo } = useQuery({
    enabled: !!signer?.account.address,
    queryFn: async () => {
      const _user = await user.get({
        account: (signer?.account.address as string) ?? '',
        env: PUSH_ENV
      });
      return _user;
    },
    queryKey: ['get-user-info']
  });

  // Helps to check if the wallet is enabled or not
  const { status } = useAccount();
  const { refresh } = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

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

  const queryClient = useQueryClient();

  const callback = useCallback(
    async (event: EVENTS, data: unknown) => {
      if (event === EVENTS.CONNECT) {
        console.info('[Stream] Connected');
      }
      if (!pgpPvtKey || !signer?.account || !userInfo) {
        return;
      }

      if (event === EVENTS.CHAT_RECEIVED_MESSAGE) {
        const decrypted = await chat.decryptConversation({
          connectedUser: userInfo,
          // connectedUser:
          env: PUSH_ENV,
          messages: [data as any],
          pgpPrivateKey: pgpPvtKey
        });

        if (!decrypted) {
          return;
        }

        const message = decrypted[0] as IMessageIPFS & {
          messageOrigin: 'others' | 'self';
        };

        if (message.messageOrigin === 'self') {
          return;
        }

        const key = ['fetch-messages', message.fromDID];

        const prevMessages = queryClient.getQueryData<
          InfiniteData<IMessageIPFSWithCID[], unknown> | undefined
        >(key);

        console.log(prevMessages, 'pp');
        if (!prevMessages) {
          return;
        }

        queryClient.setQueryData<
          InfiniteData<IMessageIPFSWithCID[], unknown> | undefined
        >(key, () => {
          const old = { ...prevMessages };

          old.pages?.[0].unshift(message as any);

          return old;
        });
      }
    },
    [pgpPvtKey, queryClient, signer?.account, userInfo]
  );

  const { stream } = usePushStream({
    account: signer?.account.address as string,
    autoConnect: true,
    callback
  });

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
                inputRef={inputRef}
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
              {allChats.length === 0 && (
                <div className="container m-auto flex min-h-[-webkit-calc(100vh-124px)] items-center justify-center bg-white">
                  <h2 className="text-xl text-gray-500">No chats found!</h2>
                </div>
              )}
            </div>
            {allChats.length > 0 &&
              allChats.map((chat) => {
                const profile = {
                  address: chat.wallets?.split(':').pop() ?? '',
                  did: chat.wallets,
                  handle: chat.name,
                  isRequestProfile: chat.type === 'request',
                  threadhash: chat.threadhash
                };
                return (
                  <div
                    className="cursor-pointer p-3"
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
            <Button
              className="my-4"
              onClick={() => inputRef.current?.focus()}
              size="lg"
            >
              New message
            </Button>
          </div>
        )}
      </GridItemEight>
    </GridLayout>
  );
};

export default ChatView;
