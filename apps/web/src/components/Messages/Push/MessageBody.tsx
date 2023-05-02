import useApproveChatRequest from '@components/utils/hooks/push/useApproveChatRequest';
import useGetHistoryMessages from '@components/utils/hooks/push/useFetchHistoryMessages';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { PUSH_TABS, usePushChatStore } from 'src/store/push-chat';
import { Image, Input } from 'ui';

import { getCAIPFromLensID } from './helper';

type GIFType = {
  url: String;
  height: Number;
  width: Number;
};

type ChatType = {
  position: number;
  content: string;
  type: string;
  timestamp: string;
  time: string;
};

function parseDate(dateTimeStamp: number) {
  let date = moment(dateTimeStamp);
  if (moment().diff(date, 'days') >= 2) {
    return date.fromNow(); // '2 days ago' etc.
  }
  return date.calendar().split(' ')[0]; // 'Yesterday', 'Today', 'Tomorrow'
}

function groupChatByTimestamp(arr: Array<ChatType>) {
  return arr.reduce((acc, chat) => {
    const { timestamp } = chat;
    if (!acc[timestamp]) {
      acc[timestamp] = [];
    }
    acc[timestamp].push(chat);
    return acc;
  }, {} as Record<string, ChatType[]>);
}

export default function MessageBody() {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const rawChats = usePushChatStore((state) => state.chats);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const setActiveTab = usePushChatStore((state) => state.setActiveTab);
  const threadHash = usePushChatStore((state) => state.threadHash);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const setRequestsFeed = usePushChatStore((state) => state.setRequestsFeed);
  const chatFeed = usePushChatStore((state) => state.chatsFeed);
  const setChatfeed = usePushChatStore((state) => state.setChatsFeed);
  const [chats, setChats] = useState<Record<string, Array<ChatType>>>({});
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const { historyMessages, loading } = useGetHistoryMessages();
  const { approveChatRequest, error } = useApproveChatRequest();
  const requestFeedids = Object.keys(requestsFeed);
  const handleApprovechatRequest = async () => {
    console.log(getCAIPFromLensID(selectedChatId));
    if (selectedChatId) {
      try {
        const response = await approveChatRequest({ senderAddress: getCAIPFromLensID(selectedChatId) });
        if (response) {
          const updatedRequestsfeed = { ...requestsFeed };
          const selectedRequest = updatedRequestsfeed[selectedChatId];
          delete updatedRequestsfeed[selectedChatId];
          setRequestsFeed(updatedRequestsfeed);

          const chatLe = { ...chatFeed };
          chatLe[selectedChatId] = selectedRequest;
          setChatfeed(chatLe);
          setActiveTab(PUSH_TABS.CHATS);
        }
      } catch (error_: Error | any) {
        console.log(error_.message);
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    (async function () {
      // only run this hook when there's a descryted key availabe in storage
      if (!decryptedPgpPvtKey) {
        return;
      }
      await historyMessages({ threadHash, chatId: selectedChatId, limit: 10 });
    })();
  }, [historyMessages, decryptedPgpPvtKey, threadHash, selectedChatId]);

  useEffect(() => {
    if (!rawChats || !rawChats.size) {
      return;
    }
    console.log({ connectedProfile });
    console.log({ rawChats });
    console.log({ key: Array.from(rawChats.values()) });
    const mappedChats = Array.from(rawChats.values())?.[0]?.map((oneRawChat) => {
      return {
        position: oneRawChat.fromDID === connectedProfile?.did ? 1 : -1,
        content: oneRawChat.messageContent,
        type: oneRawChat.messageType.toLowerCase(),
        timestamp: parseDate(oneRawChat.timestamp!),
        time: moment(oneRawChat.timestamp).format('hh:mm')
      };
    });
    console.log(mappedChats);
    const groupedChats = groupChatByTimestamp(mappedChats);
    setChats(groupedChats);
  }, [rawChats, connectedProfile]);

  const appendEmoji = ({ emoji }: { emoji: string }) => setInputText(`${inputText}${emoji}`);
  const appendGIF = (emojiObject: GIFType) => {
    console.log({ emojiObject });
  };
  const submitText = () => {
    console.log({ inputText });
  };

  const gifSample = {
    url: 'https://media.tenor.com/YGNEnwUYCf4AAAAC/annoyed-irritated.gif'
  };

  return (
    <section className="h-full	p-5 pb-3">
      <div className="h-[85%] max-h-[85%] overflow-scroll">
        {Object.entries(chats).map(([timestamp, chats], index) => (
          <section key={index} className="mb-6 mt-2">
            <p className="mb-4 text-center text-sm text-gray-400">{timestamp}</p>
            <div className="flex flex-col gap-2.5">
              {chats.map((chat, index) =>
                chat.position !== 1 ? (
                  <div
                    key={index}
                    className="relative w-fit max-w-[80%] rounded-xl rounded-tl-sm border py-3 pl-4 pr-[50px] font-medium"
                  >
                    <p className="text-sm	">{chat.content}</p>
                    <span className="absolute bottom-1.5	right-1.5 text-xs text-gray-500">{chat.time}</span>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="relative w-fit	max-w-[80%] self-end rounded-xl rounded-tr-sm border bg-violet-500 py-3 pl-4 pr-[50px] font-medium"
                  >
                    <p className="text-sm	text-white">{chat.content}</p>
                    <span className="absolute bottom-1.5	right-1.5 text-xs text-white">{chat.time}</span>
                  </div>
                )
              )}
              {/* uncomment when gifs are implemented */}
              {/* <div className="relative w-fit rounded-xl rounded-tl-sm border">
                <Image
                  className="font-medium0 relative w-fit rounded-xl rounded-tl-sm border"
                  src={gifSample.url}
                  alt=""
                />
                <Image className="absolute right-2.5 top-2.5" src="/push/giticon.svg" alt="" />
              </div> */}
            </div>
          </section>
        ))}
        {!loading ? (
          requestFeedids.includes(selectedChatId) &&
          Object.keys(requestsFeed).map((id: string) => {
            return (
              <div className="relative" key={id}>
                <div className="absolute top-8 flex w-96 rounded-e rounded-r-2xl rounded-bl-2xl border border-solid border-gray-300 p-2">
                  <div className="text-sm font-normal">
                    This is your first conversation with the sender. Please accept to continue.
                  </div>
                  <Image
                    className="h-12 cursor-pointer"
                    onClick={handleApprovechatRequest}
                    src="/push/CheckCircle.svg"
                    alt="check"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center">Loading...</div>
        )}
      </div>
      <div className="relative mt-2">
        <Image
          onClick={() => setEmojiOpen((o) => !o)}
          className="absolute left-2 top-2.5 cursor-pointer"
          src="/push/emoji.svg"
          alt=""
        />
        <div className="absolute right-4 top-2 flex items-center gap-5">
          <Image
            onClick={() => setGifOpen((o) => !o)}
            className="relative cursor-pointer"
            src="/push/gif.svg"
            alt="gif"
          />
          <Image onClick={submitText} className="relative cursor-pointer" src="/push/send.svg" alt="send" />
        </div>
        {emojiOpen ? (
          <div className="absolute bottom-[50px]">
            <EmojiPicker onEmojiClick={appendEmoji} />
          </div>
        ) : (
          ''
        )}
        {gifOpen ? (
          <div className="absolute bottom-[50px] right-0">
            <GifPicker onGifClick={appendGIF} tenorApiKey={String(process.env.NEXT_PUBLIC_GOOGLE_TOKEN)} />
          </div>
        ) : (
          ''
        )}
        <Input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          className="pl-11"
          type="text"
          placeholder="Type your message..."
        />
      </div>
    </section>
  );
}
