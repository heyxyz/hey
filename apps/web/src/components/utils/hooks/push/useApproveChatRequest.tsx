import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import { useCallback, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV } from 'src/store/push-chat';
import { useSigner } from 'wagmi';

interface approveChatParams {
  senderAddress: string;
}

const useApproveChatRequest = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { data: signer } = useSigner();

  const approveChatRequest = useCallback(
    async ({ senderAddress }: approveChatParams): Promise<String | undefined> => {
      if (!currentProfile || !signer) {
        return;
      }
      setLoading(true);
      try {
        const response = await PushAPI.chat.approve({
          status: 'Approved',
          signer: signer,
          account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${currentProfile.id}`,
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
    [currentProfile, signer]
  );

  return { approveChatRequest, error, loading };
};

export default useApproveChatRequest;
