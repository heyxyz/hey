import type { Nft } from '@hey/lens';
import type { FC } from 'react';

import { PLACEHOLDER_IMAGE } from '@hey/data/constants';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import Link from 'next/link';
import { memo } from 'react';

interface NFTProps {
  linkToDetail?: boolean;
  nft: Nft;
}

const NFTImage: FC<NFTProps> = ({ nft }) => {
  return nft?.metadata?.animationUrl ? (
    <div className="h-64 rounded-xl bg-gray-200 object-cover dark:bg-gray-800">
      {nft?.metadata?.animationUrl?.includes('.gltf') ? (
        <div
          style={{
            backgroundImage: `url(${`${PLACEHOLDER_IMAGE}`})`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}
        />
      ) : (
        <iframe
          className="h-full w-full rounded-xl bg-gray-200 object-cover dark:bg-gray-800"
          sandbox=""
          src={sanitizeDStorageUrl(nft?.metadata?.animationUrl)}
          title={`${nft.contract.address}:${nft.tokenId}`}
        />
      )}
    </div>
  ) : (
    <div
      className="h-64 rounded-xl bg-gray-200 object-cover dark:bg-gray-800"
      style={{
        backgroundImage: `url(${
          nft.metadata.image?.optimized?.uri
            ? sanitizeDStorageUrl(nft.metadata.image?.optimized?.uri)
            : PLACEHOLDER_IMAGE
        })`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain'
      }}
    />
  );
};

const NftCard: FC<NFTProps> = ({ linkToDetail = false, nft }) => {
  return linkToDetail ? (
    <Link
      className="w-full"
      href={`/nft/${nft.contract.chainId}/${nft.contract.address}/${nft.tokenId}`}
    >
      <NFTImage nft={nft} />
    </Link>
  ) : (
    <div className="w-full">
      <NFTImage nft={nft} />
    </div>
  );
};

export default memo(NftCard);
