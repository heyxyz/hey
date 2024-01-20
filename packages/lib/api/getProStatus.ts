import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

/**
 * Get Pro status of a profile
 * @param id profile id
 * @param callbackFn callback function
 * @returns Pro status
 */
const getProStatus = async (
  id: string
): Promise<{
  isBeliever: boolean;
  isPro: boolean;
}> => {
  if (!id) {
    return { isBeliever: false, isPro: false };
  }

  const response = await axios.get(`${HEY_API_URL}/pro/status`, {
    params: { id }
  });
  const { data } = response;

  return {
    isBeliever: data.isBeliever,
    isPro: data.isPro
  };
};

export default getProStatus;
