import useApproveChatRequest from '@components/utils/hooks/push/useApproveChatRequest';
import useCreateChatProfile from '@components/utils/hooks/push/useCreateChatProfile';
import useFetchChats from '@components/utils/hooks/push/useFetchChats';
import useGetHistoryMessages from '@components/utils/hooks/push/useFetchHistoryMessages';
import useFetchRequests from '@components/utils/hooks/push/useFetchRequests';
import usePushSendMessage from '@components/utils/hooks/push/usePushSendMessage';
import onError from '@lib/onError';
import type { IMessageIPFS } from '@pushprotocol/restapi';
import clsx from 'clsx';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { PUSH_TABS, usePushChatStore } from 'src/store/push-chat';
import { Image, Input, Spinner } from 'ui';

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
const CHATS_FETCH_LIMIT = 15;
const MessageCard = ({ chat, position }: { chat: IMessageIPFS; position: number }) => {
  const time = moment(chat.timestamp).format('hh:mm');
  return (
    <div
      className={clsx(
        position ? 'self-end rounded-xl rounded-tr-sm  bg-violet-500' : 'rounded-xl rounded-tl-sm',
        'relative w-fit max-w-[80%] border py-3 pl-4 pr-[50px] font-medium'
      )}
    >
      <p className={clsx(position ? 'text-white' : '', 'max-w-[100%] break-words text-sm')}>
        {chat.messageContent}
      </p>
      <span
        className={clsx(position ? 'text-white' : 'text-gray-500', 'absolute bottom-1.5	right-1.5 text-xs')}
      >
        {time}
      </span>
    </div>
  );
};

const GIFCard = ({ chat, position }: { chat: IMessageIPFS; position: number }) => {
  return (
    <div className={clsx(position ? 'self-end' : '', 'relative w-fit')}>
      <Image
        className={clsx(
          position ? 'right-0 rounded-xl rounded-tr-sm' : 'rounded-xl rounded-tl-sm',
          'font-medium0 relative w-fit border'
        )}
        src={chat.messageContent}
        alt=""
      />
      <Image className="absolute right-2.5 top-2.5" src="/push/giticon.svg" alt="" />
    </div>
  );
};

const Messages = ({ chat }: { chat: IMessageIPFS }) => {
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const position = chat.fromDID !== connectedProfile?.did ? 0 : 1;
  if (chat.messageType === 'GIF') {
    return <GIFCard chat={chat} position={position} />;
  }
  return <MessageCard chat={chat} position={position} />;
};

type MessageFieldPropType = {
  scrollToBottom: () => void;
};

const MessageField = ({ scrollToBottom }: MessageFieldPropType) => {
  const modalRef = useRef(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { sendMessage, loading: msgSendLoading } = usePushSendMessage();
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const { createChatProfile } = useCreateChatProfile();
  const { fetchChats } = useFetchChats();
  const { fetchRequests } = useFetchRequests();
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);

  const requestFeedids = Object.keys(requestsFeed);

  const appendEmoji = ({ emoji }: { emoji: string }) => setInputText(`${inputText}${emoji}`);

  const sendPushMessage = async (content: string, type: string) => {
    try {
      if (!isProfileExist(connectedProfile)) {
        await createChatProfile();
      }
      await sendMessage({
        message: content,
        receiver: getCAIPFromLensID(selectedChatId),
        messageType: type as any
      });
      scrollToBottom();

      // after a message has been sent, we can refetch all messages and chats
      await fetchChats();
      await fetchRequests();
    } catch (error) {
      onError(error);
    }
  };

  const sendGIF = async (emojiObject: GIFType) => {
    sendPushMessage(emojiObject.url as string, 'GIF');
  };

  const sendTextMsg = async () => {
    await sendPushMessage(inputText, 'Text');
    setInputText('');
  };

  useClickAway(modalRef, () => {
    setGifOpen(false);
    setEmojiOpen(false);
  });

  return (
    <>
      <Image
        onClick={() => setEmojiOpen((o) => !o)}
        className="absolute left-2 top-2.5 cursor-pointer"
        src="/push/emoji.svg"
        alt=""
      />
      <div className="absolute right-4 top-2 flex items-center gap-5">
        {!msgSendLoading ? (
          <>
            <Image
              onClick={() => setGifOpen((o) => !o)}
              className="relative cursor-pointer"
              src="/push/gif.svg"
              alt="gif"
            />
            <Image
              onClick={sendTextMsg}
              className="relative cursor-pointer"
              src="/push/send.svg"
              alt="send"
            />
          </>
        ) : (
          <div className="relative pt-[3px]">
            <Spinner size="sm" className="mx-auto" />
          </div>
        )}
      </div>
      {emojiOpen ? (
        <div ref={modalRef} className="absolute bottom-[50px]">
          <EmojiPicker onEmojiClick={appendEmoji} />
        </div>
      ) : (
        ''
      )}
      {gifOpen ? (
        <div ref={modalRef} className="absolute bottom-[50px] right-0">
          <GifPicker onGifClick={sendGIF} tenorApiKey={String(process.env.NEXT_PUBLIC_GOOGLE_TOKEN)} />
        </div>
      ) : (
        ''
      )}
      <Input
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            sendTextMsg();
          }
        }}
        value={inputText}
        className="pl-11 pr-[115px]"
        type="text"
        disabled={msgSendLoading || requestFeedids.includes(selectedChatId)}
        placeholder="Type your message..."
      />
    </>
  );
};

export default function MessageBody() {
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const listInnerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const setActiveTab = usePushChatStore((state) => state.setActiveTab);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const setRequestsFeed = usePushChatStore((state) => state.setRequestsFeed);
  const setChatfeed = usePushChatStore((state) => state.setChatsFeed);
  const chats = usePushChatStore((state) => state.chats);
  const chatsFeed = usePushChatStore((state) => state.chatsFeed);
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const selectedChat = chatsFeed[selectedChatId] || requestsFeed[selectedChatId];
  const selectedMessages = chats.get(selectedChatId);
  const prevSelectedId = useRef<string>('');

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
    if (!selectedMessages && selectedChat?.threadhash) {
      threadHash = selectedChat?.threadhash;
    } else if (chats.size && selectedMessages?.lastThreadHash) {
      threadHash = selectedMessages?.lastThreadHash;
    }
    if (threadHash) {
      await historyMessages({
        threadHash: threadHash,
        chatId: selectedChatId,
        limit: CHATS_FETCH_LIMIT
      });
    }
  };

  const scrollToBottom = (behavior?: string | null) => {
    bottomRef?.current?.scrollIntoView(!behavior ? true : { behavior: 'smooth' });
  };

  useEffect(() => {
    if (prevSelectedId.current !== selectedChatId) {
      scrollToBottom(null);
    }
    prevSelectedId.current = selectedChatId;
  }, [selectedChatId]);

  useEffect(() => {
    if (
      selectedChatId &&
      selectedMessages &&
      selectedMessages?.messages.length &&
      selectedMessages?.messages.length <= CHATS_FETCH_LIMIT
    ) {
      scrollToBottom(null);
    }
  }, [chats.get(selectedChatId)]);

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
      // if (!decryptedPgpPvtKey) {
      //   return;
      // }
      await getChatCall();
    })();
  }, [decryptedPgpPvtKey, selectedChat, selectedChatId]);

  return (
    <section className="flex h-[90%] flex-col p-5 pb-3">
      <div className="flex-grow overflow-auto px-2.5" ref={listInnerRef} onScroll={onScroll}>
        {loading ? (
          <div className="flex justify-center">
            <Spinner size="sm" />
          </div>
        ) : (
          ''
        )}

        <div className="flex flex-col gap-2.5">
          {selectedMessages?.messages.map((chat: IMessageIPFS, index: number) => (
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
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="relative mt-2">
        <MessageField scrollToBottom={scrollToBottom} />
      </div>
    </section>
  );
}
