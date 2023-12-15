import { HEY_API_URL } from '@hey/data/constants';
import cn from '@hey/ui/cn';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useMessageStore } from 'src/store/persisted/useMessageStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useInterval } from 'usehooks-ts';

import Composer from './Composer';
import SingleProfile from './SingleProfile';

const Chat: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { messages, selectedConversation, setMessages } = useMessageStore();

  const getMessages = async () => {
    try {
      const response = await axios.post(
        `${HEY_API_URL}/message/messages`,
        { conversationId: selectedConversation?.id },
        { headers: getAuthWorkerHeaders() }
      );
      const { data } = response;
      setMessages(data.messages || []);
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryFn: getMessages,
    queryKey: ['getMessages', currentProfile?.id, selectedConversation?.id]
  });

  useInterval(() => {
    getMessages();
  }, 1000);

  return (
    <div className="col-span-12 h-[calc(100vh-65px)] border-r bg-white md:col-span-12 lg:col-span-8">
      <div className="p-5">
        <SingleProfile id={selectedConversation?.profile as string} />
      </div>
      <div className="divider" />
      <div className="flex h-[calc(83vh)] w-full flex-col-reverse overflow-y-auto p-5">
        <ul className="space-y-3">
          {messages?.map((message, index) => {
            const isFromMe = message.senderId === currentProfile?.id;

            return (
              <li
                className={cn(
                  isFromMe ? 'justify-end' : 'justify-start',
                  'flex'
                )}
                key={index}
              >
                <div className="bg-brand-100 max-w-xl rounded-xl px-4 py-2">
                  <span className="block">{message.content}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="divider" />
      <div>
        <Composer />
      </div>
    </div>
  );
};

export default Chat;
