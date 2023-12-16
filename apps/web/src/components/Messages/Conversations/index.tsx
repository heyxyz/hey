import SingleProfile from '@components/Messages/SingleProfile';
import SearchUser from '@components/Shared/SearchUser';
import { HEY_API_URL } from '@hey/data/constants';
import cn from '@hey/ui/cn';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, useState } from 'react';
import { useMessageStore } from 'src/store/persisted/useMessageStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

const Conversations: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const {
    conversations,
    setConversations,
    setMessages,
    setSelectedConversation
  } = useMessageStore();
  const [searchValue, setSearchValue] = useState<string>('');

  const fetchAllConversations = async () => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/message/conversation/all`,
        { headers: getAuthWorkerHeaders() }
      );
      const { data } = response;
      setConversations(data.conversations || []);
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryFn: fetchAllConversations,
    queryKey: ['fetchAllConversations', currentProfile?.id]
  });

  const selectConversation = async (profileId: string) => {
    const response = await axios.post(
      `${HEY_API_URL}/message/conversation/get`,
      { recipient: profileId },
      { headers: getAuthWorkerHeaders() }
    );
    const { data } = response;
    const { conversation } = data;

    setMessages([]);
    setSelectedConversation({ id: conversation?.id, profile: profileId });
    setSearchValue('');
  };

  return (
    <div className="col-span-12 h-[calc(100vh-65px)] border-x bg-white md:col-span-12 lg:col-span-4">
      <div className="m-5">
        <SearchUser
          onChange={(e) => setSearchValue(e.target.value)}
          onProfileSelected={(profile) => selectConversation(profile.id)}
          placeholder="Search for a profile"
          value={searchValue}
        />
      </div>
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

export default Conversations;
