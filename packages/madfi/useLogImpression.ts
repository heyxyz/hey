import axios from 'axios';

import { MADFI_API_KEY, MADFI_API_URL } from './utils';

type LogImpressionResponse = boolean;

type LogImpressionParams = {
  chainId: string; // current chain id
  impressionType: string; // IMPRESSION | LIKE | COLLECT | MIRROR | COMMENT | LINK_CLICK | FOLLOW_CLICK
  publicationId?: string; // SPONSORED POST profileId-pubId
  promotedProfileId?: string; // PROMOTED PROFILE
  profileId?: string; // authenticated profile id
  address?: string; // authenticated profile wallet address
};

const useLogImpression = (): [
  logImpression: (data: LogImpressionParams) => Promise<LogImpressionResponse>
] => {
  const logImpression = async (
    data: LogImpressionParams
  ): Promise<LogImpressionResponse> => {
    if (!MADFI_API_KEY) {
      console.warn('Missing MADFI_API_KEY in env');
      return false;
    }

    try {
      const { status } = await axios({
        url: `${MADFI_API_URL}/impression`,
        method: 'POST',
        data: {
          ...data,
          appId: 'lenster',
        },
        headers: { 'x-api-key': MADFI_API_KEY }
      });

      return status === 200;
    } catch (error) {
      console.log(error);

      return false;
    }
  };

  return [logImpression];
};

export default useLogImpression;
