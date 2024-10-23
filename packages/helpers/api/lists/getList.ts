import { HEY_API_URL } from "@hey/data/constants";
import type { List } from "@hey/types/hey";
import axios from "axios";

const getList = async (id: string): Promise<List | null> => {
  try {
    const response = await axios.get(`${HEY_API_URL}/lists/get`, {
      params: { id }
    });

    return response.data?.result;
  } catch {
    return null;
  }
};

export default getList;
