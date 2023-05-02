import useApproveChatRequest from '@components/utils/hooks/push/useApproveChatRequest';
import useCreateChatProfile from '@components/utils/hooks/push/useCreateChatProfile';
import useGetHistoryMessages from '@components/utils/hooks/push/useFetchHistoryMessages';
import usePushSendMessage from '@components/utils/hooks/push/usePushSendMessage';
import type { IMessageIPFS } from '@pushprotocol/restapi';
import clsx from 'clsx';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { PUSH_TABS, usePushChatStore } from 'src/store/push-chat';
import { Image, Input } from 'ui';

import { getCAIPFromLensID, isProfileExist } from './helper';

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

const MessageCard = ({ chat, position }: { chat: IMessageIPFS; position: number }) => {
  const time = moment(chat.timestamp).format('hh:mm');
  return (
    <div
      className={clsx(
        position ? 'self-end rounded-xl rounded-tr-sm  bg-violet-500' : 'rounded-xl rounded-tl-sm',
        'relative w-fit max-w-[80%] border py-3 pl-4 pr-[50px] font-medium'
      )}
    >
      <p className={clsx(position ? 'text-white' : '', 'text-sm')}>{chat.messageContent}</p>
      <span
        className={clsx(position ? 'text-white' : 'text-gray-500', 'absolute bottom-1.5	right-1.5 text-xs')}
      >
        {time}
      </span>
    </div>
  );
};

const Messages = ({ chat }: { chat: IMessageIPFS }) => {
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);

  return chat.fromDID !== connectedProfile?.did ? (
    <MessageCard chat={chat} position={0} />
  ) : (
    <MessageCard chat={chat} position={1} />
  );
};

const MessageField = () => {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { sendMessage, loading: msgSendLoading } = usePushSendMessage();
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const { createChatProfile } = useCreateChatProfile();

  const appendEmoji = ({ emoji }: { emoji: string }) => setInputText(`${inputText}${emoji}`);
  const appendGIF = (emojiObject: GIFType) => {
    console.log({ emojiObject });
  };

  const sendMsg = async () => {
    console.log({ inputText });
    if (!isProfileExist(connectedProfile)) {
      await createChatProfile();
    }
    await sendMessage({
      message: inputText,
      receiver: getCAIPFromLensID(selectedChatId),
      messageType: 'Text'
    });
    setInputText('');
  };

  const gifSample = {
    url: 'https://media.tenor.com/YGNEnwUYCf4AAAAC/annoyed-irritated.gif'
  };

  return (
    <>
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
        <Image onClick={sendMsg} className="relative cursor-pointer" src="/push/send.svg" alt="send" />
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
        disabled={msgSendLoading}
        placeholder="Type your message..."
      />
    </>
  );
};

export default function MessageBody() {
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const listInnerRef = useRef<HTMLDivElement>(null);

  const setActiveTab = usePushChatStore((state) => state.setActiveTab);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const setRequestsFeed = usePushChatStore((state) => state.setRequestsFeed);
  const setChatfeed = usePushChatStore((state) => state.setChatsFeed);
  const chats = usePushChatStore((state) => state.chats);
  const chatsFeed = usePushChatStore((state) => state.chatsFeed);
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const selectedChat = chatsFeed[selectedChatId] || requestsFeed[selectedChatId];

  //add loading in jsx
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

          const chatLe = { ...chatsFeed };
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

  const getChatCall = async () => {
    let threadHash = null;
    if (!chats.get(selectedChatId) && selectedChat?.threadhash) {
      threadHash = selectedChat?.threadhash;
    } else if (chats.size && chats.get(selectedChatId)?.lastThreadHash) {
      threadHash = chats.get(selectedChatId)?.lastThreadHash;
    }
    if (threadHash) {
      await historyMessages({
        threadHash: threadHash,
        chatId: selectedChatId,
        limit: 10
      });
    }
  };

  const onScroll = async () => {
    if (listInnerRef.current) {
      const { scrollTop } = listInnerRef.current;
      if (scrollTop === 0) {
        let content = listInnerRef.current;
        let curScrollPos = content.scrollTop;
        let oldScroll = content.scrollHeight - content.clientHeight;

        await getChatCall();

        let newScroll = content.scrollHeight - content.clientHeight;
        content.scrollTop = curScrollPos + (newScroll - oldScroll);
      }
    }
  };

  useEffect(() => {
    (async function () {
      // only run this hook when there's a descryted key availabe in storage
      if (!decryptedPgpPvtKey) {
        return;
      }
      await getChatCall();
    })();
  }, [decryptedPgpPvtKey, selectedChat, selectedChatId]);

  return (
    <section className="h-full	p-5 pb-3">
      <div className="h-[85%] max-h-[85%] overflow-scroll " ref={listInnerRef} onScroll={onScroll}>
        <div className="flex flex-col gap-2.5">
          {chats.get(selectedChatId)?.messages.map((chat: IMessageIPFS, index: number) => (
            <Messages chat={chat} key={index} />
          ))}
          {requestFeedids.includes(selectedChatId) && (
            <div className="flex w-96 rounded-e rounded-r-2xl rounded-bl-2xl border border-solid border-gray-300 p-2">
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
      </div>

      {/* typebar  design */}
      <div className="relative mt-2">
        <MessageField />
      </div>
    </section>
  );
}
