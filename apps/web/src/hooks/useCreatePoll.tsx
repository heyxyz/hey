import { HEY_API_URL } from '@hey/data/constants';
import getProfile from '@hey/lib/getProfile';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import axios from 'axios';
import { useAppStore } from 'src/store/useAppStore';
import { usePublicationStore } from 'src/store/usePublicationStore';

type CreatePollResponse = string;

const useCreatePoll = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const pollConfig = usePublicationStore((state) => state.pollConfig);
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );

  // TODO: use useCallback
  const createPoll = async (): Promise<CreatePollResponse> => {
    try {
      const response = await axios.post(
        `${HEY_API_URL}/snapshot/createPoll`,
        {
          title: `Poll by ${getProfile(currentProfile).slugWithPrefix}`,
          description: publicationContent,
          choices: pollConfig.choices,
          length: pollConfig.length
        },
        { headers: getAuthWorkerHeaders() }
      );

      return `${publicationContent}\n\n${response.data.snapshotUrl}`;
    } catch (error) {
      throw error;
    }
  };

  return createPoll;
};

export default useCreatePoll;
