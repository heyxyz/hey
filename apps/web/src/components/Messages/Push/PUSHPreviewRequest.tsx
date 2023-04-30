import Loader from '@components/Shared/Loader';
import usefetchRequest from '@components/utils/hooks/push/useFetchRequests';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import type { ParsedChatType } from 'src/store/push-chat';
import { usePushChatStore } from 'src/store/push-chat';

export default function PUSHPreviewChats() {
  const router = useRouter();
  const conversationKey = router.query;

  const [parsedChats, setParsedChats] = useState<any>([]);
  const { fetchRequests, loading } = usefetchRequest();
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  // load all requestsFeed
  useEffect(() => {
    (async function () {
      // only run this hook when there's a descryted key availabe in storage
      if (!decryptedPgpPvtKey) {
        return;
      }
      await fetchRequests();
    })();
  }, [decryptedPgpPvtKey, fetchRequests]);

  // transform all chats
  useEffect(() => {
    console.log(Array.from(requestsFeed.values()));
    const transformedChats = Array.from(requestsFeed.values()).map((chat) => {
      const extendedChat = { name: '', ...chat };

      return {
        id: extendedChat.chatId,
        img: extendedChat.profilePicture,
        name: extendedChat.name || 'Randome Name',
        text: extendedChat.msg.messageContent,
        time: moment(extendedChat.msg.timestamp).fromNow(),
        recipient: extendedChat.msg.toDID.split(':')[4]
      };
    });

    setParsedChats(transformedChats);
  }, [requestsFeed]);

  // action for when you click on a chat
  const onChatFeedClick = (chatId: string, recipient: string) => {
    router.push(`/messages/push/chat/${chatId}/${recipient}`);
  };
  console.log(conversationKey[1]);
  return (
    <section className="flex flex-col	gap-2.5	">
      {!loading ? (
        parsedChats.map((chat: ParsedChatType, index: number) => (
          <div
            onClick={() => onChatFeedClick(chat.id, chat.recipient)}
            key={index}
            className={`flex h-16 cursor-pointer gap-2.5 rounded-lg  p-2.5 pr-3 transition-all hover:bg-gray-100 ${
              selectedChatId === chat.id && 'bg-brand-100'
            }`}
          >
            <img className="h-12	w-12 rounded-full" src={chat.img} alt="" />
            <div className="flex w-full	justify-between	">
              <div>
                <p className="bold max-w-[180px] truncate text-base">
                  {chat.name}-${index}
                </p>
                <p className="text-sm text-gray-500	">{chat.text}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex h-full flex-grow items-center justify-center">
          <Loader message="Loading Requests" />
        </div>
      )}
    </section>
  );
}
