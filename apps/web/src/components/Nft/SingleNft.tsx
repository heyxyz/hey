import { RARIBLE_URL, STATIC_IMAGES_URL } from '@lenster/data/constants';
import type { Nft } from '@lenster/lens';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import Link from 'next/link';
import type { FC } from 'react';
import { CHAIN_ID } from 'src/constants';
import { Card } from 'ui';

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
      {nft?.originalContent?.animatedUrl ? (
        <div className="divider h-52 sm:h-80 sm:rounded-t-[10px]">
          {nft?.originalContent?.animatedUrl?.includes('.gltf') ? (
            <Link href={nftURL ?? ''} target="_blank" rel="noreferrer noopener">
              <div
                style={{
                  backgroundImage: `url(${`${STATIC_IMAGES_URL}/placeholder.webp`})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </Link>
          ) : (
            <iframe
              title={`${nft.contractAddress}:${nft.tokenId}`}
              sandbox=""
              src={sanitizeDStorageUrl(nft?.originalContent?.animatedUrl)}
            />
          )}
        </div>
      ) : (
        <Link href={nftURL ?? ''} target="_blank" rel="noreferrer noopener">
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
        </Link>
      )}
      <div className="space-y-1 p-5">
        {nft.collectionName && (
          <div className="lt-text-gray-500 truncate text-sm">
            {nft.collectionName}
          </div>
        )}
        <div className="truncate">
          <Link
            className="font-bold"
            href={nftURL ?? ''}
            target="_blank"
            rel="noreferrer noopener"
          >
            {nft.name ? nft.name : `#${nft.tokenId}`}
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default SingleNft;
