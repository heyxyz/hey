import { SPACES_WORKER_URL } from '@lenster/data/constants';
import getBasicWorkerPayload from '@lib/getBasicWorkerPayload';
import axios from 'axios';
import { useSpacesStore } from 'src/store/spaces';

type CreateSpaceResponse = {
  success: boolean;
  response: {
    message: string;
    data: {
      roomId: string;
    }
  }
};

const useCreateSpace = (): [createPoll: () => Promise<CreateSpaceResponse>] => {
  const {
    isTokenGated,
    tokenGateConditionType,
    tokenGateConditionValue,
    spacesTimeInHour,
    spacesTimeInMinute
  } = useSpacesStore();``
  let payload = {};
  const now = new Date();
  now.setHours(Number(spacesTimeInHour));
  now.setMinutes(Number(spacesTimeInMinute));
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedTime = new Date(
    now.toLocaleString('en-US', { timeZone: userTimezone })
  );
  const startTime = formattedTime.toISOString();
  const createSpace = async (): Promise<CreateSpaceResponse> => {
    if (isTokenGated) {
      payload = {
        ...getBasicWorkerPayload(),
        conditionType: tokenGateConditionType,
        conditionValue: tokenGateConditionValue,
        isTokenGated: isTokenGated,
        startTime: startTime
      };
    } else {
      payload = {
        ...getBasicWorkerPayload(),
        startTime: startTime
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
