import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import type { Profile } from 'lens';
import { useCallback, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

interface conversationHashParams {
  conversationId: string;
}

interface conversationHashResponseType {
  threadHash: string;
}

const useGetConversationHash = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);

  const getConversationHash = useCallback(
    async ({
      conversationId
    }: conversationHashParams): Promise<
      conversationHashResponseType | undefined
    > => {
      setLoading(true);
      try {
        const response = await PushAPI.chat.conversationHash({
          conversationId,
          account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${
            (currentProfile as Profile)?.id
          }`,
          env: PUSH_ENV
        });
        setLoading(false);
        return response;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      }
    },
    [currentProfile, connectedProfile]
  );
  return { getConversationHash, error, loading };
};

export default useGetConversationHash;
