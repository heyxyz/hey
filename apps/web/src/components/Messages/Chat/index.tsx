import type { Message } from 'src/store/persisted/useMessageStore';

import { HEY_API_URL } from '@hey/data/constants';
import cn from '@hey/ui/cn';
import { formatDate } from '@lib/formatTime';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useInView } from 'react-cool-inview';
import { useMessageStore } from 'src/store/persisted/useMessageStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

import SingleProfile from '../SingleProfile';
import Composer from './Composer';

const Chat: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const {
    messages,
    messagesPaginationOffset,
    selectedConversation,
    setMessages,
    setMessagesPaginationOffset
  } = useMessageStore();

  const fetchAllMessages = async (limit: number, offset: number) => {
    try {
      if (!selectedConversation?.id) {
        return false;
      }

      const response = await axios.post(
        `${HEY_API_URL}/message/all`,
        { conversationId: selectedConversation?.id, limit, offset },
        { headers: getAuthWorkerHeaders() }
      );
      const { data } = response;

      if (offset === 0) {
        setMessages(data.messages);
      } else {
        setMessages([...(messages as Message[]), ...data.messages]);
      }

      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryFn: async () => await fetchAllMessages(20, messagesPaginationOffset),
    queryKey: [
      'fetchAllMessages',
      selectedConversation?.id,
      messagesPaginationOffset
    ]
  });

  const { observe } = useInView({
    onChange: ({ inView }) => {
      if (!inView) {
        return;
      }

      setMessagesPaginationOffset(messagesPaginationOffset + 20);
    }
  });

  return (
    <div className="col-span-12 h-[calc(100vh-65px)] border-r bg-white md:col-span-12 lg:col-span-8">
      <div className="px-5 py-3">
        <SingleProfile
          fullProfile
          id={selectedConversation?.profile as string}
        />
      </div>
      <div className="divider" />
      <div className="flex h-[calc(82.5vh)] w-full flex-col-reverse overflow-y-auto p-5">
        {messages?.map((message, index, messages) => {
          const isFromMe = message.senderId === currentProfile?.id;
          return (
            <div
              className={cn(
                isFromMe ? 'justify-end' : 'justify-start',
                'mt-6 flex'
              )}
              key={message.id}
            >
              <div
                className={cn(
                  isFromMe ? ' items-end' : ' items-start',
                  'flex flex-col'
                )}
                ref={index === messages.length - 1 ? observe : null}
              >
                <div>
                  <div className="bg-brand-100 max-w-xl rounded-xl px-4 py-2">
                    <span className="block">{message.content}</span>
                  </div>
                </div>
                <span className="ld-text-gray-500">
                  <span className="text-xs">
                    {formatDate(
                      new Date(message.createdAt),
                      'MMM D, YYYY, hh:mm A'
                    )}
                    {isFromMe && ' · Sent'}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="divider" />
      <div>
        <Composer />
      </div>
    </div>
  );
};

export default Chat;
