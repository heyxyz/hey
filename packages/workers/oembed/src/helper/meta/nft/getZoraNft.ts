import type { OpenSeaNft } from '@lenster/types/opensea-nft';

import getNftMetadata from './getNftMetadata';

export const regex =
  /https:\/\/zora.co\/collect\/(eth|base|zora):([^/]+)\/([^/]+)/;

const getOpenseaChain = (chain: string): string => {
  switch (chain) {
    case 'eth':
      return 'ethereum';
    case 'base':
      return 'base';
    case 'zora':
      return 'zora';
    default:
      return 'ethereum';
  }
};

const getZoraNft = async (url: string): Promise<OpenSeaNft | null> => {
  const matches = regex.exec(url);
  if (regex.test(url) && matches?.length === 4) {
    const chain = getOpenseaChain(matches[1]);
    const contract = matches[2];
    const token = matches[3];

    return await getNftMetadata(chain, contract, token);
  }

  return null;
};

export default getZoraNft;
