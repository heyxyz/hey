import { Card } from '@components/UI/Card';
import type { Nft } from '@generated/types';
import getIPFSLink from '@lib/getIPFSLink';
import type { FC } from 'react';
import { CHAIN_ID, RARIBLE_URL, STATIC_IMAGES_URL } from 'src/constants';

interface Props {
  nft: Nft;
}

const SingleNFT: FC<Props> = ({ nft }) => {
  const nftURL = `${RARIBLE_URL}/token/${nft.chainId === CHAIN_ID ? 'polygon/' : ''}${nft.contractAddress}:${
    nft.tokenId
  }`.toLowerCase();

  return (
    <Card>
      {nft?.originalContent?.animatedUrl ? (
        <div className="h-52 border-b sm:h-80 sm:rounded-t-[10px]">
          {nft?.originalContent?.animatedUrl?.includes('.gltf') ? (
            <a href={nftURL} target="_blank" rel="noreferrer noopener">
              <div
                className="h-52 border-b sm:h-80 sm:rounded-t-[10px]"
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
              className="w-full h-full sm:rounded-t-[10px]"
              src={nft?.originalContent?.animatedUrl}
            />
          )}
        </div>
      ) : (
        <a href={nftURL} target="_blank" rel="noreferrer noopener">
          <div
            className="h-52 border-b sm:h-80 sm:rounded-t-[10px]"
            style={{
              backgroundImage: `url(${
                nft.originalContent.uri
                  ? getIPFSLink(nft.originalContent.uri)
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
        {nft.collectionName && <div className="text-sm text-gray-500 truncate">{nft.collectionName}</div>}
        <div className="truncate">
          <a className="font-bold" href={nftURL} target="_blank" rel="noreferrer noopener">
            {nft.name ? nft.name : `#${nft.tokenId}`}
          </a>
        </div>
      </div>
    </Card>
  );
};

export default SingleNFT;
