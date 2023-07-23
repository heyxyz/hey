import { SPACES_WORKER_URL } from '@lenster/data/constants';
import getBasicWorkerPayload from '@lib/getBasicWorkerPayload';
import axios from 'axios';

type CreateSpaceResponse = string;

const useCreateSpace = (): [createPoll: () => Promise<CreateSpaceResponse>] => {
  const createSpace = async (): Promise<CreateSpaceResponse> => {
    try {
      const response = await axios({
        url: `${SPACES_WORKER_URL}/createSpace`,
        method: 'POST',
        data: getBasicWorkerPayload()
      });

      return response.data.spaceId;
    } catch (error) {
      throw error;
    }
  };

  return [createSpace];
};

export default useCreateSpace;
