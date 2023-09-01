import type { OpenSeaNft } from '@lenster/types/opensea-nft';

import getOpenseaNft from './getOpenseaNft';
import getZoraNft from './getZoraNft';

const knownSites = ['opensea.io', 'zora.co'];

const getNft = async (url: string): Promise<OpenSeaNft | null> => {
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.replace('www.', '');

  if (!knownSites.includes(hostname)) {
    return null;
  }

  switch (hostname) {
    case 'opensea.io':
      return await getOpenseaNft(url);
    case 'zora.co':
      return await getZoraNft(url);
    default:
      return null;
  }
};

export default getNft;
