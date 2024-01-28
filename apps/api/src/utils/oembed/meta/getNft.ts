import type { Nft } from '@hey/types/misc';
import type { Document } from 'linkedom';

// https://reflect.site/g/yoginth/nft-extended-open-graph-spec/780502f3c8a3404bb2d7c39ec091602e
const getNft = (document: Document): Nft | null => {
  const collection =
    document.querySelector('meta[name="eth:nft:collection"]') ||
    document.querySelector('meta[property="eth:nft:collection"]');
  const contract_address =
    document.querySelector('meta[name="eth:nft:contract_address"]') ||
    document.querySelector('meta[property="eth:nft:contract_address"]');
  const creator_address =
    document.querySelector('meta[name="eth:nft:creator_address"]') ||
    document.querySelector('meta[property="eth:nft:creator_address"]');
  const nft_chain =
    document.querySelector('meta[name="eth:nft:chain"]') ||
    document.querySelector('meta[property="eth:nft:chain"]');
  const nft_media_url =
    document.querySelector('meta[name="eth:nft:media_url"]') ||
    document.querySelector('meta[property="eth:nft:media_url"]') ||
    document.querySelector('meta[name="og:image"]') ||
    document.querySelector('meta[property="og:image"]');
  const nft_mint_count =
    document.querySelector('meta[name="eth:nft:mint_count"]') ||
    document.querySelector('meta[property="eth:nft:mint_count"]');
  const nft_mint_status =
    document.querySelector('meta[name="eth:nft:mint_status"]') ||
    document.querySelector('meta[property="eth:nft:mint_status"]');
  const nft_mint_url =
    document.querySelector('meta[name="eth:nft:mint_url"]') ||
    document.querySelector('meta[property="eth:nft:mint_url"]');
  const nft_schema =
    document.querySelector('meta[name="eth:nft:schema"]') ||
    document.querySelector('meta[property="eth:nft:schema"]');

  const processedCollection = collection?.getAttribute('content') || null;
  const processedContractAddress =
    contract_address?.getAttribute('content') || null;
  const processedCreatorAddress =
    creator_address?.getAttribute('content') || null;
  const processedNftChain = nft_chain?.getAttribute('content') || null;
  const processedNftMediaUrl = nft_media_url?.getAttribute('content') || null;
  const processedNftMintCount = nft_mint_count?.getAttribute('content')
    ? parseInt(nft_mint_count?.getAttribute('content') as string)
    : null;
  const processedNftMintStatus =
    nft_mint_status?.getAttribute('content') || null;
  const processedNftMintUrl = nft_mint_url?.getAttribute('content') || null;
  const processedNftSchema = nft_schema?.getAttribute('content') || null;

  if (
    !processedCollection &&
    !processedContractAddress &&
    !processedCreatorAddress &&
    !processedNftSchema
  ) {
    return null;
  }

  return {
    collection: processedCollection,
    contract_address: processedContractAddress,
    creator_address: processedCreatorAddress,
    nft_chain: processedNftChain,
    nft_media_url: processedNftMediaUrl,
    nft_mint_count: processedNftMintCount,
    nft_mint_status: processedNftMintStatus,
    nft_mint_url: processedNftMintUrl,
    nft_schema: processedNftSchema
  };
};

export default getNft;
