import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';
import { usePublicationPollStore } from 'src/store/non-persisted/publication/usePublicationPollStore';

import useLensAuthData from './useLensAuthData';

type CreatePollResponse = string;

const useCreatePoll = () => {
  const { pollConfig } = usePublicationPollStore();
  const lensAuthData = useLensAuthData();

  // TODO: use useCallback
  const createPoll = async (): Promise<CreatePollResponse> => {
    const response = await axios.post(
      `${HEY_API_URL}/polls/create`,
      {
        length: pollConfig.length,
        options: pollConfig.options
      },
      { headers: lensAuthData.headers }
    );

    return response.data.poll.id;
  };

  return createPoll;
};

export default useCreatePoll;
