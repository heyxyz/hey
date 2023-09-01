import type { OpenSeaNft } from '@lenster/types/opensea-nft';

import getOpenseaNft from './getOpenseaNft';

const knownSites = ['opensea.io'];

const getNft = async (url: string): Promise<OpenSeaNft | null> => {
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.replace('www.', '');

  if (!knownSites.includes(hostname)) {
    return null;
  }

  switch (hostname) {
    case 'opensea.io':
      return await getOpenseaNft(url);
    default:
      return null;
  }
};

export default getNft;
