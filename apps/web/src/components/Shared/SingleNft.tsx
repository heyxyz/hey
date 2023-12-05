import type { Nft } from '@hey/lens';
import type { FC } from 'react';

import { PLACEHOLDER_IMAGE, RARIBLE_URL } from '@hey/data/constants';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import { Card } from '@hey/ui';
import { CHAIN_ID } from 'src/constants';

interface SingleNftProps {
  linkToDetail?: boolean;
  nft: Nft;
}

const SingleNft: FC<SingleNftProps> = ({ linkToDetail = true, nft }) => {
  const nftURL = linkToDetail
    ? `${RARIBLE_URL}/token/${
        nft.contract.chainId === CHAIN_ID ? 'polygon/' : ''
      }${nft.contract.address}:${nft.tokenId}`.toLowerCase()
    : undefined;

  return (
    <Card forceRounded>
      <div
        className="cursor-pointer"
        onClick={() => nftURL && window.open(nftURL, '_blank')}
      >
        {nft?.metadata?.animationUrl ? (
          <div className="divider h-52 sm:h-60 sm:rounded-t-[10px]">
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
                className="h-full w-full rounded-b-none"
                sandbox=""
                src={sanitizeDStorageUrl(nft?.metadata?.animationUrl)}
                title={`${nft.contract.address}:${nft.tokenId}`}
              />
            )}
          </div>
        ) : (
          <div
            className="divider h-52 sm:h-60 sm:rounded-t-[10px]"
            style={{
              backgroundImage: `url(${
                nft.metadata.image?.optimized?.uri
                  ? sanitizeDStorageUrl(nft.metadata.image.optimized.uri)
                  : PLACEHOLDER_IMAGE
              })`,
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain'
            }}
          />
        )}
        <div className="space-y-1 px-5 py-3 text-sm">
          {nft.collection.name ? (
            <div className="ld-text-gray-500 truncate">
              {nft.collection.name}
            </div>
          ) : null}
          <div className="truncate">
            {nft.metadata.name ? nft.metadata.name : `#${nft.tokenId}`}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SingleNft;
