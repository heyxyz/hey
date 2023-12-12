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

  const response = await axios.get(`${HEY_API_URL}/tba/deployed`, {
    params: { address }
  });
  const { data } = response;
  callbackFn?.(data?.deployed || false);

  return data?.deployed || false;
};

export default getTbaStatus;
