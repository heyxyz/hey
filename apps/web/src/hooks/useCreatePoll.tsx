import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

import getAuthWorkerHeaders from '@/lib/getAuthWorkerHeaders';
import { usePublicationStore } from '@/store/non-persisted/usePublicationStore';

type CreatePollResponse = string;

const useCreatePoll = () => {
  const pollConfig = usePublicationStore((state) => state.pollConfig);

  // TODO: use useCallback
  const createPoll = async (): Promise<CreatePollResponse> => {
    try {
      const response = await axios.post(
        `${HEY_API_URL}/poll/create`,
        {
          options: pollConfig.options,
          length: pollConfig.length
        },
        { headers: getAuthWorkerHeaders() }
      );

      return response.data.id;
    } catch (error) {
      throw error;
    }
  };

  return createPoll;
};

export default useCreatePoll;
