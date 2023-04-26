import * as PushAPI from '@pushprotocol/restapi';
import { PUSH_ENV } from 'src/store/push-chat';
import type { IFeeds } from '@pushprotocol/restapi/src/lib/types';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';

const useGetPushConversations = (decryptedKeys: string | null) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [conversations, setConversations] = useState<IFeeds[]>([]);
  const { ownedBy } = currentProfile || {};
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const chats = await PushAPI.chat.chats({
          account: `eip155:${ownedBy}`,
          toDecrypt: true,
          pgpPrivateKey: decryptedKeys as string,
          env: PUSH_ENV
        });
        if (!chats) {
          return;
        }
        setConversations(chats);
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();
  }, [decryptedKeys, ownedBy]);
  return { conversations };
};

export default useGetPushConversations;
