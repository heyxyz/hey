import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';
import { useSigner } from 'wagmi';

interface SendMessageParams {
  message: string;
  receiver: string;
  messageType?: 'Text' | 'Image' | 'File' | 'GIF' | 'MediaURL';
}

// ToDo: Need to enable it for gif and image type msg as well
const usePushSendMessage = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const { data: signer } = useSigner();

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const sendMessage = useCallback(
    async ({ message, receiver, messageType = 'Text' }: SendMessageParams): Promise<boolean | undefined> => {
      if (!decryptedPgpPvtKey || !message || !signer) {
        setError('something went wrong');
        return false;
      }
      setLoading(true);
      try {
        const response = await PushAPI.chat.send({
          messageContent: message,
          messageType: messageType,
          receiverAddress: receiver,
          signer,
          pgpPrivateKey: decryptedPgpPvtKey,
          env: PUSH_ENV
        });
        setLoading(false);
        if (!response) {
          return false;
        }
        return true;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      }
    },
    [decryptedPgpPvtKey, signer]
  );
  return { sendMessage, error, loading };
};

export default usePushSendMessage;
