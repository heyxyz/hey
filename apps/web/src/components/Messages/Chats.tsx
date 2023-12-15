import SingleProfile from '@components/Messages/SingleProfile';
import { HEY_API_URL } from '@hey/data/constants';
import cn from '@hey/ui/cn';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
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
      const response = await axios.get(`${HEY_API_URL}/message/conversations`, {
        headers: getAuthWorkerHeaders()
      });
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
              setSelectedConversation({
                id: conversation.id,
                profile: conversation.profile
              });
            }}
          >
            <SingleProfile
              id={conversation.profile}
              message={conversation.latestMessages}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
