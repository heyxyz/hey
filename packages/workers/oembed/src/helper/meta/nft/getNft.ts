import type { Token } from '@lenster/zora';

import getZoraNft from './getZoraNFT';

const knownSites = ['zora.co'];

const getNft = async (url: string): Promise<Token | null> => {
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.replace('www.', '');

  if (!knownSites.includes(hostname)) {
    return null;
  }

  switch (hostname) {
    case 'zora.co':
      return await getZoraNft(url);
    default:
      return null;
  }
};

export default getNft;
