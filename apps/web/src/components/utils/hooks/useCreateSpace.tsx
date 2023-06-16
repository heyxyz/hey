import { IS_MAINNET, SPACES_WORKER_URL } from '@lenster/data';
import axios from 'axios';
import { useReadLocalStorage } from 'usehooks-ts';

type CreateSpaceResponse = string;

const useCreateSpace = (): [createPoll: () => Promise<CreateSpaceResponse>] => {
  const accessToken = useReadLocalStorage('accessToken');
  const createSpace = async (): Promise<CreateSpaceResponse> => {
    try {
      const response = await axios({
        url: `${SPACES_WORKER_URL}/createSpace`,
        method: 'POST',
        data: {
          isMainnet: IS_MAINNET,
          accessToken
        }
      });

      return response.data.spaceId;
    } catch (error) {
      throw error;
    }
  };

  return [createSpace];
};

export default useCreateSpace;
