// import * as PushAPI from '@pushprotocol/restapi';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';

const useGetPushConversations = (decryptedKeys: string, reciever: string) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  // const [chats, setChats] = useState(null);

  const { ownedBy } = currentProfile || {};

  useEffect(() => {
    const fetchOldChats = async () => {
      try {
        // const conversationHash = await PushAPI.chat.conversationHash({
        //   account: `eip155:${ownedBy}`,
        //   conversationId: `eip155:${reciever}` // receiver's address or chatId of a group
        // });
        // const chatHistory = await PushAPI.chat.history({
        //   threadhash: conversationHash.threadHash,
        //   account: `eip155:${ownedBy}`,
        //   limit: 2,
        //   toDecrypt: true,
        //   pgpPrivateKey: decryptedKeys
        // });
        // setChats(chatHistory);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOldChats();
  }, [decryptedKeys, ownedBy, reciever]);
  return { chats: {} };
};

export default useGetPushConversations;
