import { HEY_API_URL } from "@hey/data/constants";
import axios from "axios";

/**
 * Resolves ENS names for the specified EVM addresses.
 * @param addresses An array of EVM addresses.
 * @returns An array of ENS names.
 */
const resolveEns = async (addresses: string[]) => {
  try {
    const { data } = await axios.post(`${HEY_API_URL}/ens`, {
      addresses: addresses.map((address) => address.split("/")[0])
    });

    return data;
  } catch {
    return [];
  }
};

export default resolveEns;
