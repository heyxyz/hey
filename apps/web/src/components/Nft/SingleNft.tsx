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
    ? `${RARIBLE_URL}/token/${nft.chainId === CHAIN_ID ? 'polygon/' : ''}${
        nft.contractAddress
      }:${nft.tokenId}`.toLowerCase()
    : undefined;

  return (
    <Card>
      <div
        onClick={() => nftURL && window.open(nftURL, '_blank')}
        className="cursor-pointer"
      >
        {nft?.originalContent?.animatedUrl ? (
          <div className="divider h-52 sm:h-80 sm:rounded-t-[10px]">
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
                src={sanitizeDStorageUrl(nft?.originalContent?.animatedUrl)}
              />
            )}
          </div>
        ) : (
          <div
            className="divider h-52 sm:h-80 sm:rounded-t-[10px]"
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
        )}
        <div className="space-y-1 p-5">
          {nft.collectionName && (
            <div className="lt-text-gray-500 truncate text-sm">
              {nft.collectionName}
            </div>
          )}
          <div className="truncate">
            {nft.name ? nft.name : `#${nft.tokenId}`}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SingleNft;
