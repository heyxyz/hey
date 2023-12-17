import type { IMessageIPFS } from '@pushprotocol/uiweb';

import {
  getAccountFromProfile,
  getProfileIdFromDID
} from '@components/Messages/Push/helper';
import PushAPI from '@pushprotocol/restapi';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import useProfileStore from 'src/store/persisted/useProfileStore';
import {
  PUSH_ENV,
  usePushChatStore
} from 'src/store/persisted/usePushChatStore';

import useNotification from './useNotification';

const usePushSocket = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const setRecipientChat = usePushChatStore((state) => state.setRecipientChat);
  const { sendNotification } = useNotification();

  const pushSocket = createSocketConnection({
    env: PUSH_ENV,
    socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
    socketType: 'chat',
    user: getAccountFromProfile(currentProfile?.id)
  });

  pushSocket?.on(
    EVENTS.CHAT_RECEIVED_MESSAGE,
    async (message: IMessageIPFS) => {
      const user = await PushAPI.user.get({
        account: getAccountFromProfile(currentProfile?.id),
        env: PUSH_ENV
      });

      const decryptedMessage = await PushAPI.chat.decryptConversation({
        connectedUser: user,
        messages: [message],
        pgpPrivateKey: pgpPrivateKey!
      });
      setRecipientChat(decryptedMessage[0]);

      const from = getProfileIdFromDID(decryptedMessage[0].fromDID);
      const body = decryptedMessage[0].messageContent;
      sendNotification(`Message From: ${from}`, {
        body: body
      });
    }
  );

  return pushSocket;
};

export default usePushSocket;
