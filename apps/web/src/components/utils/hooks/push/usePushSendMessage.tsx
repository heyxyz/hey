import { getCAIPFromLensID } from '@components/Messages/Push/helper';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { useAppStore } from 'src/store/app';
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
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const chats = usePushChatStore((state) => state.chats);
  const setChat = usePushChatStore((state) => state.setChat);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { data: signer } = useSigner();

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const sendMessage = useCallback(
    async ({ message, receiver, messageType = 'Text' }: SendMessageParams): Promise<boolean | undefined> => {
      if (!currentProfile) {
        return;
      }
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
          account: getCAIPFromLensID(currentProfile.id),
          pgpPrivateKey: decryptedPgpPvtKey,
          env: PUSH_ENV
        });
        setLoading(false);
        if (!response) {
          return false;
        }

        const modifiedResponse = { ...response, messageContent: message };
        if (chats.get(selectedChatId)) {
          setChat(selectedChatId, {
            messages: [...chats.get(selectedChatId)!.messages, modifiedResponse],
            lastThreadHash: chats.get(selectedChatId)!.lastThreadHash
          });
        } else {
          setChat(selectedChatId, {
            messages: [modifiedResponse],
            lastThreadHash: chats.get(selectedChatId)!.lastThreadHash
          });
        }

        return true;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      }
    },
    [currentProfile, decryptedPgpPvtKey, signer, setChat, selectedChatId, chats]
  );
  return { sendMessage, error, loading };
};

export default usePushSendMessage;
