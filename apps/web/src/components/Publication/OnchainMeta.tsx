import { Card } from '@components/UI/Card';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { IPFS_GATEWAY, POLYGONSCAN_URL } from 'data/constants';
import type { Publication } from 'lens';
import type { FC } from 'react';

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
  publication: Publication;
}

const OnchainMeta: FC<Props> = ({ publication }) => {
  const hash = publication.onChainContentURI?.split('/').pop();
  const isArweaveHash = hash?.length === 43;
  const isIPFSHash = hash?.length === 46 || hash?.length === 59;

  if (!isArweaveHash && !isIPFSHash && !publication?.collectNftAddress) {
    return null;
  }

  return (
    <Card as="aside">
      <div className="lt-text-gray-500 divide-y dark:divide-gray-700">
        {isArweaveHash ? (
          <Meta name={t`ARWEAVE TRANSACTION`} uri={`https://viewblock.io/arweave/tx/${hash}`} hash={hash} />
        ) : null}
        {isIPFSHash ? <Meta name="IPFS TRANSACTION" uri={`${IPFS_GATEWAY}${hash}`} hash={hash} /> : null}
        {publication?.collectNftAddress ? (
          <Meta
            name={t`NFT ADDRESS`}
            uri={`${POLYGONSCAN_URL}/token/${publication?.collectNftAddress}`}
            hash={publication?.collectNftAddress}
          />
        ) : null}
      </div>
    </Card>
  );
};

export default OnchainMeta;
