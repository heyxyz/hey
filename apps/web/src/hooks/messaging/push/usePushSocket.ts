import type { IMessageIPFS } from '@pushprotocol/uiweb';

import {
  getAccountFromProfile,
  getProfileIdFromDID
} from '@components/Messages/Push/helper';
import * as PushAPI from '@pushprotocol/restapi';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import useProfileStore from 'src/store/persisted/useProfileStore';
import {
  PUSH_ENV,
  usePushChatStore
} from 'src/store/persisted/usePushChatStore';

const usePushSocket = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const setRecipientChat = usePushChatStore((state) => state.setRecipientChat);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);

  const pushSocket = createSocketConnection({
    env: PUSH_ENV,
    socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
    socketType: 'chat',
    user: getAccountFromProfile(currentProfile?.id)
  });

  pushSocket?.on(
    EVENTS.CHAT_RECEIVED_MESSAGE,
    async (message: IMessageIPFS) => {
      try {
        const decryptedMessageResponse = await PushAPI.chat.decryptConversation(
          {
            connectedUser: connectedProfile!,
            env: PUSH_ENV,
            messages: [message],
            pgpPrivateKey: pgpPrivateKey!
          }
        );
        const decryptedMessage = decryptedMessageResponse[0];
        const profileID = getProfileIdFromDID(decryptedMessage.fromDID);

        if (profileID === currentProfile?.id) {
          return;
        }

        setRecipientChat(decryptedMessage);
      } catch (error) {
        console.log('SOCKET ERROR:', error);
      }
    }
  );

  return pushSocket;
};

export default usePushSocket;
