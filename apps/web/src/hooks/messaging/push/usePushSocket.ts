import type { IMessageIPFSWithCID } from '@pushprotocol/restapi';

import {
  getAccountFromProfile,
  getProfileIdFromDID
} from '@components/Messages/Push/helper';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import useProfileStore from 'src/store/persisted/useProfileStore';
import {
  PUSH_ENV,
  usePushChatStore
} from 'src/store/persisted/usePushChatStore';

import useNotification from './useNotification';
import usePushHooks from './usePush';

const usePushSocket = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const setRecipientChat = usePushChatStore((state) => state.setRecipientChat);
  const { decryptConversation } = usePushHooks();
  const user = getAccountFromProfile(currentProfile?.id);
  const { sendNotification } = useNotification();

  const pushSocket = createSocketConnection({
    env: PUSH_ENV,
    socketOptions: { autoConnect: false, reconnectionAttempts: 3 },
    socketType: 'chat',
    user: user
  });

  pushSocket?.on(
    EVENTS.CHAT_RECEIVED_MESSAGE,
    async (message: IMessageIPFSWithCID) => {
      try {
        const decryptedMessage = await decryptConversation(message);
        const profileID = getProfileIdFromDID(decryptedMessage.fromDID);

        if (profileID === currentProfile?.id) {
          return;
        }
        setRecipientChat([decryptedMessage]);
        sendNotification(`New Message from ${profileID}`);
      } catch (error) {
        console.log('SOCKET ERROR:', error);
      }
    }
  );

  return pushSocket;
};

export default usePushSocket;
