import type { SignerType } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { useCallback } from 'react';

const usePushSendMessage = () => {
  const sendMessage = useCallback(
    async (
      message: string,
      decryptedKeys: string | null,
      receiver: string,
      signer: SignerType
    ): Promise<boolean | undefined> => {
      if (!decryptedKeys || !message) {
        return false;
      }
      try {
        const response = await PushAPI.chat.send({
          messageContent: message,
          messageType: 'Text',
          receiverAddress: `eip155:${receiver}`,
          signer,
          pgpPrivateKey: decryptedKeys,
          env: ENV.STAGING
        });
        if (!response) {
          return false;
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    []
  );
  return { sendMessage };
};

export default usePushSendMessage;
