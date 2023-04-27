import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import type { Profile } from 'lens';
import { useCallback, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV } from 'src/store/push-chat';

interface approveChatParams {
  senderAddress: string;
}

const useApproveChatRequest = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const approveChatRequest = useCallback(
    async ({ senderAddress }: approveChatParams): Promise<String | undefined> => {
      setLoading(true);
      try {
        const response = await PushAPI.chat.approve({
          status: 'Approved',
          account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${(currentProfile as Profile)?.id}`,
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
