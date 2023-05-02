import { STATIC_IMAGES_URL } from 'data/constants';
import type { Nft } from 'lens';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface NFTProps {
  nft: Nft;
  linkToDetail?: boolean;
}

const NFTImage: FC<NFTProps> = ({ nft }) => {
  return nft?.originalContent?.animatedUrl ? (
    <div className="h-64 rounded-xl bg-gray-200 object-cover dark:bg-gray-800">
      {nft?.originalContent?.animatedUrl?.includes('.gltf') ? (
        <div
          style={{
            backgroundImage: `url(${`${STATIC_IMAGES_URL}/placeholder.webp`})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ) : (
        <iframe
          title={`${nft.contractAddress}:${nft.tokenId}`}
          sandbox=""
          className="h-full w-full rounded-xl bg-gray-200 object-cover dark:bg-gray-800"
          src={sanitizeDStorageUrl(nft?.originalContent?.animatedUrl)}
        />
      )}
    </div>
  ) : (
    <div
      className="h-64 rounded-xl bg-gray-200 object-cover dark:bg-gray-800"
      style={{
        backgroundImage: `url(${
          nft.originalContent.uri
            ? sanitizeDStorageUrl(nft.originalContent.uri)
            : `${STATIC_IMAGES_URL}/placeholder.webp`
        })`,
        backgroundSize: 'contain',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }}
    />
  );
};

const NftCard: FC<NFTProps> = ({ nft, linkToDetail = false }) => {
  return linkToDetail ? (
    <Link href={`/nft/${nft.contractAddress}/${nft.tokenId}`} className="w-full">
      <NFTImage nft={nft} />
    </Link>
  ) : (
    <div className="w-full">
      <NFTImage nft={nft} />
    </div>
  );
};

export default React.memo(NftCard);
