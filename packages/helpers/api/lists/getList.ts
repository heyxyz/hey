import { HEY_API_URL } from "@hey/data/constants";
import type { List } from "@hey/types/hey";
import axios from "axios";

export const GET_LIST_QUERY_KEY = "getList";

interface Payload {
  id: null | string;
  viewingId?: null | string;
}

const getList = async (payload: Payload): Promise<List | null> => {
  try {
    const response = await axios.get(`${HEY_API_URL}/lists/get`, {
      params: payload
    });

    return response.data?.result;
  } catch {
    return null;
  }
};

export default getList;
