import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

/**
 * Get TBA status of an address
 * @param address address
 * @param callbackFn callback function
 * @returns TBA status
 */
const getTbaStatus = async (
  address: string,
  callbackFn?: (deployed: boolean) => void
): Promise<boolean> => {
  if (!address) {
    return false;
  }

  try {
    const response = await axios.get(`${HEY_API_URL}/tba/deployed`, {
      params: { address }
    });
    const { data } = response;
    callbackFn?.(data?.deployed || []);

    return data?.deployed || [];
  } catch (error) {
    throw error;
  }
};

export default getTbaStatus;
