import type { Nft } from '@hey/types/misc';
import type { Document } from 'linkedom';
import type { Address } from 'viem';

// https://reflect.site/g/yoginth/hey-nft-extended-open-graph-spec/780502f3c8a3404bb2d7c39ec091602e
const getNft = (document: Document, url: string): Nft | null => {
  const getMeta = (key: string) => {
    const selector = `meta[name="${key}"], meta[property="${key}"]`;
    const metaTag = document.querySelector(selector);
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const collectionName = getMeta('eth:nft:collection') as string;
  const contractAddress = getMeta('eth:nft:contract_address') as Address;
  const creatorAddress = getMeta('eth:nft:creator_address') as Address;
  const chain = getMeta('eth:nft:chain') || getMeta('nft:chain');
  const mediaUrl =
    getMeta('og:image') || (getMeta('eth:nft:media_url') as string);
  const mintCount = getMeta('eth:nft:mint_count') as string;
  const mintStatus = getMeta('eth:nft:status');
  const mintUrl = getMeta('eth:nft:mint_url') as string;
  const schema = getMeta('eth:nft:schema') as string;
  const endTime = getMeta('eth:nft:endtime');

  if (!collectionName && !contractAddress && !creatorAddress && !schema) {
    return null;
  }

  return {
    chain,
    collectionName,
    contractAddress,
    creatorAddress,
    endTime,
    mediaUrl,
    mintCount,
    mintStatus,
    mintUrl,
    schema,
    sourceUrl: url
  };
};

export default getNft;
