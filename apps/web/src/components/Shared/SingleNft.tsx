import { PLACEHOLDER_IMAGE, RARIBLE_URL } from '@hey/data/constants';
import type { Nft } from '@hey/lens';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import { Card } from '@hey/ui';
import { type FC } from 'react';
import { CHAIN_ID } from '@constants';

interface SingleNftProps {
  nft: Nft;
  linkToDetail?: boolean;
}

const SingleNft: FC<SingleNftProps> = ({ nft, linkToDetail = true }) => {
  const nftURL = linkToDetail
    ? `${RARIBLE_URL}/token/${
        nft.contract.chainId === CHAIN_ID ? 'polygon/' : ''
      }${nft.contract.address}:${nft.tokenId}`.toLowerCase()
    : undefined;

  return (
    <Card forceRounded>
      <div
        onClick={() => nftURL && window.open(nftURL, '_blank')}
        className="cursor-pointer"
      >
        {nft?.metadata?.animationUrl ? (
          <div className="divider h-52 sm:h-60 sm:rounded-t-[10px]">
            {nft?.metadata?.animationUrl?.includes('.gltf') ? (
              <div
                style={{
                  backgroundImage: `url(${`${PLACEHOLDER_IMAGE}`})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            ) : (
              <iframe
                className="h-full w-full rounded-b-none"
                title={`${nft.contract.address}:${nft.tokenId}`}
                sandbox=""
                src={sanitizeDStorageUrl(nft?.metadata?.animationUrl)}
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
              backgroundSize: 'contain',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
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
