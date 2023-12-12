import { HEY_API_URL } from '@hey/data/constants';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import axios from 'axios';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';

type CreatePollResponse = string;

const useCreatePoll = () => {
  const pollConfig = usePublicationStore((state) => state.pollConfig);

  // TODO: use useCallback
  const createPoll = async (): Promise<CreatePollResponse> => {
    const response = await axios.post(
      `${HEY_API_URL}/poll/create`,
      {
        length: pollConfig.length,
        options: pollConfig.options
      },
      { headers: getAuthWorkerHeaders() }
    );

    return response.data.id;
  };

  return createPoll;
};

export default useCreatePoll;
