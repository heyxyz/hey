import type { Nft } from '@hey/types/misc';
import type { Document } from 'linkedom';
import type { Address } from 'viem';

import getNftChainId from '@hey/helpers/getNftChainId';

const IGNORED_HOSTS = ['hey.xyz'];

// https://reflect.site/g/yoginth/hey-nft-extended-open-graph-spec/780502f3c8a3404bb2d7c39ec091602e
const getNft = (document: Document, sourceUrl: string): Nft | null => {
  if (IGNORED_HOSTS.includes(new URL(sourceUrl).hostname)) {
    return null;
  }

  const getMeta = (key: string) => {
    const selector = `meta[name="${key}"], meta[property="${key}"]`;
    const metaTag = document.querySelector(selector);
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const collectionName = getMeta('eth:nft:collection') as string;
  const creatorAddress = getMeta('eth:nft:creator_address') as Address;
  const chain = getMeta('eth:nft:chain') || getMeta('nft:chain');
  const mediaUrl = (getMeta('og:image') ||
    getMeta('eth:nft:media_url')) as string;

  if (!collectionName || !mediaUrl) {
    const hasFCFrame = getMeta('fc:frame:button:1:action') === 'mint';

    if (hasFCFrame) {
      const target = getMeta('fc:frame:button:1:target');
      const collectionName = getMeta('og:title') as string;

      const chain = target?.startsWith('eip')
        ? getNftChainId(target.split(':')[1])
        : null;
      const mediaUrl = (getMeta('fc:frame:image') ||
        getMeta('og:image')) as string;

      if (!collectionName || !mediaUrl) {
        return null;
      }

      return {
        chain,
        collectionName,
        creatorAddress: null,
        mediaUrl,
        sourceUrl
      };
    }

    return null;
  }

  return { chain, collectionName, creatorAddress, mediaUrl, sourceUrl };
};

export default getNft;
