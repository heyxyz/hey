import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import axios from "axios";
import { usePostPollStore } from "src/store/non-persisted/post/usePostPollStore";

type CreatePollResponse = string;

const useCreatePoll = () => {
  const { pollConfig } = usePostPollStore();

  // TODO: use useCallback
  const createPoll = async (): Promise<CreatePollResponse> => {
    const { data } = await axios.post(
      `${HEY_API_URL}/polls/create`,
      {
        length: pollConfig.length,
        options: pollConfig.options
      },
      { headers: getAuthApiHeaders() }
    );

    return data.result.id;
  };

  return createPoll;
};

export default useCreatePoll;
