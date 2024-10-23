import { HEY_API_URL } from "@hey/data/constants";
import type { List } from "@hey/types/hey";
import axios from "axios";

const getLists = async (id: string): Promise<List[]> => {
  try {
    const response = await axios.get(`${HEY_API_URL}/lists/all`, {
      params: { id }
    });

    return response.data?.result;
  } catch {
    return [];
  }
};

export default getLists;
