import { RARIBLE_URL, STATIC_IMAGES_URL } from '@lenster/data/constants';
import type { Nft } from '@lenster/lens';
import sanitizeDStorageUrl from '@lenster/lib/sanitizeDStorageUrl';
import { Card } from '@lenster/ui';
import type { FC } from 'react';
import { CHAIN_ID } from 'src/constants';

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
                  backgroundImage: `url(${`${STATIC_IMAGES_URL}/placeholder.webp`})`,
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
                  : `${STATIC_IMAGES_URL}/placeholder.webp`
              })`,
              backgroundSize: 'contain',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
        <div className="space-y-1 px-5 py-3 text-sm">
          {nft.collection.name ? (
            <div className="lt-text-gray-500 truncate">
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
