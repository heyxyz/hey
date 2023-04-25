import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { PUSH_ENV } from 'src/store/push-chat';

interface conversationHashParams {
  account: string;
  conversationId: string;
}

interface conversationHashResponseType {
  threadHash: string;
}

const useGetConversationHash = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const getConversationHash = useCallback(
    async ({
      account,
      conversationId
    }: conversationHashParams): Promise<conversationHashResponseType | undefined> => {
      setLoading(true);
      try {
        const response = await PushAPI.chat.conversationHash({
          conversationId,
          account,
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
    []
  );
  return { getConversationHash, error, loading };
};

export default useGetConversationHash;
