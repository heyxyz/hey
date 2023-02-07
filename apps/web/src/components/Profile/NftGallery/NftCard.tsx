import { RARIBLE_URL, STATIC_IMAGES_URL } from 'data/constants';
import type { Nft } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';
import { CHAIN_ID } from 'src/constants';
import getIPFSLink from 'utils/getIPFSLink';

interface Props {
  nft: Nft;
  linkToDetail?: boolean;
}

const NFTImage: FC<Props> = ({ nft }) => {
  const nftURL = `${RARIBLE_URL}/token/${nft.chainId === CHAIN_ID ? 'polygon/' : ''}${nft.contractAddress}:${
    nft.tokenId
  }`.toLowerCase();
  return nft?.originalContent?.animatedUrl ? (
    <div className="h-64 rounded-xl bg-gray-200 object-cover dark:bg-gray-800">
      {nft?.originalContent?.animatedUrl?.includes('.gltf') ? (
        <a href={nftURL} target="_blank" rel="noreferrer noopener">
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
          className="h-full w-full rounded-xl bg-gray-200 object-cover dark:bg-gray-800"
          src={nft?.originalContent?.animatedUrl}
        />
      )}
    </div>
  ) : (
    <a href={nftURL} target="_blank" rel="noreferrer noopener">
      <div
        className="h-64 rounded-xl bg-gray-200 object-cover dark:bg-gray-800"
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
  );
};

const NftCard: FC<Props> = ({ nft, linkToDetail = false }) => {
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

export default NftCard;
