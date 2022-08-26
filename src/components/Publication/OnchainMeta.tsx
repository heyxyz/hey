import { Card } from '@components/UI/Card';
import { LensterPublication } from '@generated/lenstertypes';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import React, { FC } from 'react';
import { POLYGONSCAN_URL } from 'src/constants';

interface MetaProps {
  name: string;
  uri: string;
  hash: string;
}

const Meta: FC<MetaProps> = ({ name, uri, hash }) => (
  <div className="px-5 py-3">
    <a href={uri} className="space-y-1" target="_blank" rel="noreferrer noopener">
      <div className="flex items-center space-x-1">
        <div className="text-[10px]">{name}</div>
        <ExternalLinkIcon className="w-4 h-4" />
      </div>
      <div className="truncate text-xs">{hash}</div>
    </a>
  </div>
);

interface Props {
  publication: LensterPublication;
}

const OnchainMeta: FC<Props> = ({ publication }) => {
  const hash = publication.onChainContentURI.split('/').pop();
  const isArweaveHash = hash?.length === 43;
  const isIPFSHash = hash?.length === 46;

  if (!isArweaveHash && !isIPFSHash && !publication?.collectNftAddress) {
    return null;
  }

  return (
    <Card as="aside">
      <div className="text-gray-500 divide-y dark:divide-gray-700">
        {isArweaveHash ? (
          <Meta name="ARWEAVE TRANSACTION" uri={`https://v2.viewblock.io/arweave/tx/${hash}`} hash={hash} />
        ) : null}
        {isIPFSHash ? (
          <Meta name="IPFS TRANSACTION" uri={`https://cf-ipfs.com/ipfs/${hash}`} hash={hash} />
        ) : null}
        {publication?.collectNftAddress ? (
          <Meta
            name="NFT ADDRESS"
            uri={`${POLYGONSCAN_URL}/token/${publication?.collectNftAddress}`}
            hash={publication?.collectNftAddress}
          />
        ) : null}
      </div>
    </Card>
  );
};

export default OnchainMeta;
