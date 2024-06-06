import { GOOD_API_URL } from '@good/data/constants';
import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import axios from 'axios';
import { usePublicationPollStore } from 'src/store/non-persisted/publication/usePublicationPollStore';

type CreatePollResponse = string;

const useCreatePoll = () => {
  const { pollConfig } = usePublicationPollStore();

  // TODO: use useCallback
  const createPoll = async (): Promise<CreatePollResponse> => {
    const response = await axios.post(
      `${GOOD_API_URL}/polls/create`,
      {
        length: pollConfig.length,
        options: pollConfig.options
      },
      { headers: getAuthApiHeaders() }
    );

    return response.data.poll.id;
  };

  return createPoll;
};

export default useCreatePoll;
