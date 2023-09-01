import type { Token } from '@lenster/zora';

import getZoraNetwork from './getZoraNetwork';
import getZoraToken from './getZoraToken';

export const regex =
  /https:\/\/zora.co\/collect\/(eth|base|zora):([^/]+)\/([^/]+)/;

const getZoraNFT = async (url: string): Promise<Token | null> => {
  const matches = regex.exec(url);
  if (regex.test(url) && matches?.length === 4) {
    const network = getZoraNetwork(matches[1]);
    const contract = matches[2];
    const token = matches[3];
    const nft = await getZoraToken(network, contract, token);

    return nft;
  }

  return null;
};

export default getZoraNFT;
