import type { Message } from '@pushprotocol/restapi';
import type {
  GetNextPageParamFunction,
  QueryFunction
} from '@tanstack/react-query';

import { getAccountFromProfile } from '@components/Messages/Push/helper';
import * as PushAPI from '@pushprotocol/restapi';
import { PGPHelper } from '@pushprotocol/restapi/src/lib/chat/helpers';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import useProfileStore from 'src/store/persisted/useProfileStore';
import {
  PUSH_ENV,
  usePushChatStore
} from 'src/store/persisted/usePushChatStore';
import { useWalletClient } from 'wagmi';

export const MAX_CHAT_ITEMS = 30;

const usePushHooks = () => {
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const recepientProfile = usePushChatStore((state) => state.recipientProfile);
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const recepientAccount = getAccountFromProfile(recepientProfile?.id!);
  const account = getAccountFromProfile(currentProfile?.id);
  const { data: signer } = useWalletClient();

  const queryKeys = {
    APPROVE_USER: ['approveUser'],
    GET_CHAT_HISTORY: ['getChatHistory', recepientProfile?.id],
    GET_CHAT_REQUESTS: ['getChatRequests', recepientProfile?.id!],
    GET_CHATS: ['getChats', recepientProfile?.id!],
    REJECT_USER: ['rejectUser'],
    SEND_MESSAGE: ['sendMessage']
  };

  const getBaseConfig = () => {
    return {
      account: account,
      env: PUSH_ENV,
      pgpPrivateKey: pgpPrivateKey!,
      signer: signer!
    };
  };

  const useApproveUser = () => {
    return useMutation({
      mutationFn: async () => {
        try {
          await PushAPI.chat.approve({
            ...getBaseConfig(),
            senderAddress: recepientAccount,
            status: 'Approved'
          });
        } catch (error) {
          throw new Error('Failed to approve user');
        }
      },
      mutationKey: queryKeys.APPROVE_USER
    });
  };

  const useRejectUser = () => {
    return useMutation({
      mutationFn: async () => {
        try {
          await PushAPI.chat.reject({
            ...getBaseConfig(),
            senderAddress: recepientAccount
          });
        } catch (error) {
          throw new Error('Failed to reject user');
        }
      },
      mutationKey: queryKeys.REJECT_USER
    });
  };

  const useSendMessage = () => {
    return useMutation({
      mutationFn: async (message: Message) => {
        const response = await PushAPI.chat.send({
          ...getBaseConfig(),
          message,
          to: recepientAccount
        });
        return response;
      },
      mutationKey: queryKeys.SEND_MESSAGE
    });
  };
  const decryptPGPKey = async (
    password: string,
    account: string,
    encryptedPGPPrivateKey: string
  ) => {
    try {
      const response = (await PushAPI.chat.decryptPGPKey({
        ...getBaseConfig(),
        account: account,
        additionalMeta: { NFTPGP_V1: { password: password } },
        encryptedPGPPrivateKey: encryptedPGPPrivateKey
      })) as string;
      return response;
    } catch (error) {
      throw new Error('Failed to decrypt PGP key');
    }
  };

  const decryptConversation = async (message: PushAPI.IMessageIPFS) => {
    try {
      const response = await PushAPI.chat.decryptConversation({
        ...getBaseConfig(),
        connectedUser: connectedProfile!,
        messages: [message],
        pgpHelper: PGPHelper
      });
      return response[0] as PushAPI.IMessageIPFSWithCID;
    } catch (error) {
      throw new Error('Failed to decrypt conversation');
    }
  };

  const useCustomInfiniteQuery = <TQueryFnData>(
    queryKey: string[],
    queryFn: QueryFunction<TQueryFnData, string[], number>,
    getNextPageParam: GetNextPageParamFunction<number, TQueryFnData>
  ) => {
    return useInfiniteQuery({
      getNextPageParam,
      initialPageParam: 1,
      queryFn,
      queryKey,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 604_800
    });
  };

  const useGetChats = () => {
    return useCustomInfiniteQuery(
      queryKeys.GET_CHATS,
      ({ pageParam }) =>
        PushAPI.chat.chats({
          ...getBaseConfig(),
          ...(pageParam && {
            limit: MAX_CHAT_ITEMS,
            page: pageParam
          }),
          toDecrypt: true
        }),
      (_, allPages, lastPageParam) => {
        if (lastPageParam === 1 && allPages[0].length < MAX_CHAT_ITEMS) {
          return;
        }
        return allPages[allPages.length - 1].length < MAX_CHAT_ITEMS
          ? lastPageParam + 1
          : undefined;
      }
    );
  };

  const useGetChatRequests = () => {
    return useCustomInfiniteQuery(
      queryKeys.GET_CHAT_REQUESTS,
      ({ pageParam }) =>
        PushAPI.chat.requests({
          ...getBaseConfig(),
          ...(pageParam && {
            limit: MAX_CHAT_ITEMS,
            page: pageParam
          }),
          toDecrypt: true
        }),
      (_, allPages, lastPageParam) => {
        if (lastPageParam === 1 && allPages[0].length < MAX_CHAT_ITEMS) {
          return;
        }
        return allPages[allPages.length - 1].length < MAX_CHAT_ITEMS
          ? lastPageParam + 1
          : undefined;
      }
    );
  };

  const useGetChatHistory = () => {
    return useInfiniteQuery({
      enabled: recepientProfile?.threadHash ? true : false,
      getNextPageParam: (lastPage) => {
        return lastPage.length - 1 < MAX_CHAT_ITEMS
          ? lastPage[lastPage.length - 1]?.cid
          : undefined;
      },
      initialPageParam: recepientProfile?.threadHash ?? '',
      queryFn: async ({ pageParam }: { pageParam: string }) => {
        if (!pageParam) {
          return [];
        }
        const history = await PushAPI.chat.history({
          ...getBaseConfig(),
          limit: MAX_CHAT_ITEMS,
          threadhash: pageParam,
          toDecrypt: true
        });
        return history as PushAPI.IMessageIPFSWithCID[];
      },
      queryKey: queryKeys.GET_CHAT_HISTORY,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 604_800
    });
  };

  return {
    decryptConversation,
    decryptPGPKey,
    useApproveUser,
    useGetChatHistory,
    useGetChatRequests,
    useGetChats,
    useRejectUser,
    useSendMessage
  };
};

export default usePushHooks;
