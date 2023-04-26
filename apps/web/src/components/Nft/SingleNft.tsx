import { IS_RARIBLE_AVAILABLE, LINEA_EXPLORER_URL, RARIBLE_URL, STATIC_IMAGES_URL } from 'data/constants';
import type { Nft } from 'lens';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import type { FC } from 'react';
import { useMemo } from 'react';
import { CHAIN_ID } from 'src/constants';
import { Card } from 'ui';

interface SingleNftProps {
  nft: Nft;
  linkToDetail?: boolean;
}

const SingleNft: FC<SingleNftProps> = ({ nft, linkToDetail = true }) => {
  const nftUrl = useMemo(() => {
    if (linkToDetail) {
      if (IS_RARIBLE_AVAILABLE) {
        return `${RARIBLE_URL}/token/${nft.chainId === CHAIN_ID ? 'linea/' : ''}${nft.contractAddress}:${
          nft.tokenId
        }`.toLowerCase();
      } else {
        return `${LINEA_EXPLORER_URL}/token/${nft.contractAddress}/${nft.tokenId}`.toLowerCase();
      }
    }
  }, [linkToDetail, nft.chainId, nft.tokenId, nft.contractAddress]);

  return (
    <Card>
      {nft?.originalContent?.animatedUrl ? (
        <div className="divider h-52 sm:h-80 sm:rounded-t-[10px]">
          {nft?.originalContent?.animatedUrl?.includes('.gltf') ? (
            <a href={nftUrl} target="_blank" rel="noreferrer noopener">
              <div
                style={{
                  backgroundImage: `url(${`${STATIC_IMAGES_URL}/placeholder.webp`})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </a>
          ) : (
            <iframe
              title={`${nft.contractAddress}:${nft.tokenId}`}
              sandbox=""
              src={sanitizeDStorageUrl(nft?.originalContent?.animatedUrl)}
            />
          )}
        </div>
      ) : (
        <a href={nftUrl} target="_blank" rel="noreferrer noopener">
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
        </a>
      )}
      <div className="space-y-1 p-5">
        {nft.collectionName && <div className="lt-text-gray-500 truncate text-sm">{nft.collectionName}</div>}
        <div className="truncate">
          <a className="font-bold" href={nftUrl} target="_blank" rel="noreferrer noopener">
            {nft.name ? nft.name : `#${nft.tokenId}`}
          </a>
        </div>
      </div>
    </Card>
  );
};

export default SingleNft;
