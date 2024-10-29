import { HEY_API_URL } from "@hey/data/constants";
import type { List } from "@hey/types/hey";
import axios from "axios";

export const GET_LISTS_QUERY_KEY = "getLists";

interface Payload {
  ownerId: null | string;
  viewingId?: null | string;
}

const getLists = async (payload: Payload): Promise<List[]> => {
  try {
    const response = await axios.get(`${HEY_API_URL}/lists/all`, {
      params: payload
    });

    return response.data?.result;
  } catch {
    return [];
  }
};

export default getLists;
