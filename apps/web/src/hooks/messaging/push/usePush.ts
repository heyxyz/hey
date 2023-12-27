import type { MessageType } from '@pushprotocol/restapi/src/lib/constants';

import { getAccountFromProfile } from '@components/Messages/Push/helper';
import * as PushAPI from '@pushprotocol/restapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useProfileStore from 'src/store/persisted/useProfileStore';
import {
  PUSH_ENV,
  usePushChatStore
} from 'src/store/persisted/usePushChatStore';
import { useWalletClient } from 'wagmi';

const usePushHooks = () => {
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const recepientProfie = usePushChatStore((state) => state.recipientProfile);
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const recepientAccount = getAccountFromProfile(recepientProfie?.id);
  const account = getAccountFromProfile(currentProfile?.id);
  const { data: signer } = useWalletClient();

  const getBaseConfig = () => {
    return {
      account: account,
      env: PUSH_ENV,
      pgpPrivateKey: pgpPrivateKey!,
      signer: signer
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
      mutationKey: ['approveUser']
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
      mutationKey: ['rejectUser']
    });
  };

  const useSendMessage = () => {
    return useMutation({
      mutationFn: async (message: {
        content: string;
        reference?: string;
        type: MessageType;
      }) => {
        const response = await PushAPI.chat.send({
          ...getBaseConfig(),
          message: {
            content: message.content,
            ...(message.reference ? { reference: message.reference } : {}),
            // @ts-ignore
            type: message.type
          },
          to: recepientAccount
        });

        return response;
      },
      mutationKey: ['sendMessage']
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
        messages: [message]
      });
      return response[0];
    } catch (error) {
      throw new Error('Failed to decrypt conversation');
    }
  };

  const useGetChats = () => {
    return useQuery({
      queryFn: async () => {
        const chats = await PushAPI.chat.chats({
          ...getBaseConfig(),
          toDecrypt: true
        });
        return chats;
      },
      queryKey: ['getChats']
    });
  };

  const useGetChatRequests = () => {
    return useQuery({
      queryFn: async () => {
        const chats = await PushAPI.chat.requests({
          ...getBaseConfig(),
          toDecrypt: true
        });
        return chats;
      },
      queryKey: ['getChatsRequests']
    });
  };

  return {
    decryptConversation,
    decryptPGPKey,
    useApproveUser,
    useGetChatRequests,
    useGetChats,
    useRejectUser,
    useSendMessage
  };
};

export default usePushHooks;
