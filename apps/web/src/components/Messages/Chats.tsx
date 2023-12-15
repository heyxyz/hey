import SingleProfile from '@components/Messages/SingleProfile';
import { HEY_API_URL } from '@hey/data/constants';
import cn from '@hey/ui/cn';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useMessageStore } from 'src/store/persisted/useMessageStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

const Chats: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { conversations, setConversations, setSelectedConversation } =
    useMessageStore();

  const fetchConversations = async () => {
    try {
      const response = await axios.post(
        `${HEY_API_URL}/message/conversations`,
        { profile: currentProfile?.id }
      );
      const { data } = response;
      setConversations(data.conversations || []);
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryFn: fetchConversations,
    queryKey: ['fetchConversations', currentProfile?.id]
  });

  return (
    <div className="col-span-12 h-[calc(100vh-65px)] border-x bg-white md:col-span-12 lg:col-span-4">
      <div>
        {conversations?.map((conversation) => (
          <div
            className={cn('cursor-pointer px-5 py-3 hover:bg-gray-100')}
            key={conversation.id}
            onClick={() => {
              setSelectedConversation(conversation.id);
            }}
          >
            <SingleProfile
              id={conversation.sender}
              message={conversation.messages?.[0]?.content}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
