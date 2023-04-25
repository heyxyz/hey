import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { PUSH_ENV } from 'src/store/push-chat';

interface approveChatParams {
  account: string;
  senderAddress: string;
}

const useApproveChatRequest = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const approveChatRequest = useCallback(
    async ({ account, senderAddress }: approveChatParams): Promise<String | undefined> => {
      setLoading(true);
      try {
        const response = await PushAPI.chat.approve({
          status: 'Approved',
          account,
          senderAddress: senderAddress, // receiver's address or chatId of a group
          env: PUSH_ENV
        });
        return response;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      }
    },
    []
  );

  return { approveChatRequest, error, loading };
};

export default useApproveChatRequest;
