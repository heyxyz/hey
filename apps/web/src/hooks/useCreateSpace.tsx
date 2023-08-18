import { SPACES_WORKER_URL } from '@lenster/data/constants';
import getBasicWorkerPayload from '@lib/getBasicWorkerPayload';
import axios from 'axios';
import { useSpacesStore } from 'src/store/spaces';

type CreateSpaceResponse = string;

const useCreateSpace = (): [createPoll: () => Promise<CreateSpaceResponse>] => {
  const { isTokenGated, tokenGateConditionType, tokenGateConditionValue } =
    useSpacesStore();
  let payload = {};
  const createSpace = async (): Promise<CreateSpaceResponse> => {
    if (isTokenGated) {
      payload = {
        ...getBasicWorkerPayload(),
        conditionType: tokenGateConditionType,
        conditionValue: tokenGateConditionValue
      };
    }
    try {
      const response = await axios({
        url: `${SPACES_WORKER_URL}/createSpace`,
        method: 'POST',
        data: payload
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return [createSpace];
};

export default useCreateSpace;
