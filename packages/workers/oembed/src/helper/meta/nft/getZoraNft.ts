import type { ZoraNft } from '@lenster/types/zora-nft';

import getZoraNftMetadata from './getZoraNftMetadata';

export const regex =
  /https:\/\/zora.co\/collect\/(eth|base|zora):(0x[\dA-Fa-f]{40})((?:\/(\d+))?|$)/;

const getZoraNFT = async (url: string): Promise<ZoraNft | null> => {
  const matches = regex.exec(url);
  if (regex.test(url) && matches && matches.length >= 3) {
    const chain = matches[1];
    const contract = matches[2];
    const token = matches[3];
    const nft = await getZoraNftMetadata(chain, contract, token);

    return nft;
  }

  return null;
};

export default getZoraNFT;
