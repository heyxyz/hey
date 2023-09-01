import type { OpenSeaNft } from '@lenster/types/opensea-nft';

import { OPENSEA_KEY } from '../../../constants';

const getNftMetadata = async (
  chain: string,
  contract: string,
  token: string
): Promise<OpenSeaNft | null> => {
  try {
    const response: {
      ok: boolean;
      json: () => Promise<{ nft: OpenSeaNft }>;
    } = await fetch(
      `https://api.opensea.io/v2/chain/${chain}/contract/${contract}/nfts/${token}`,
      {
        headers: { 'X-API-KEY': OPENSEA_KEY },
        cf: {
          cacheTtl: 60 * 60 * 24 * 7,
          cacheEverything: true
        }
      }
    );

    const data = await response.json();

    return { ...data.nft, chain };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getNftMetadata;
