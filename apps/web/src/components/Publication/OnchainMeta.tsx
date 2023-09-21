import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { IPFS_GATEWAY, POLYGONSCAN_URL } from '@lenster/data/constants';
import type { AnyPublication } from '@lenster/lens';
import { isMirrorPublication } from '@lenster/lib/publicationHelpers';
import { Card } from '@lenster/ui';
import { t } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';

interface MetaProps {
  name: string;
  uri: string;
  hash: string;
}

const Meta: FC<MetaProps> = ({ name, uri, hash }) => (
  <div className="px-5 py-3">
    <Link
      href={uri}
      className="space-y-1"
      target="_blank"
      rel="noreferrer noopener"
    >
      <div className="flex items-center space-x-1">
        <div className="text-[10px]">{name}</div>
        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
      </div>
      <div className="truncate text-xs">{hash}</div>
    </Link>
  </div>
);

interface OnchainMetaProps {
  publication: AnyPublication;
}

const OnchainMeta: FC<OnchainMetaProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const hash = targetPublication.metadata.rawURI?.split('/').pop();
  const collectNftAddress = targetPublication?.collectNftAddress;
  const isArweaveHash = hash?.length === 43;
  const isIPFSHash = hash?.length === 46 || hash?.length === 59;

  if (!isArweaveHash && !isIPFSHash && !collectNftAddress) {
    return null;
  }

  return (
    <Card as="aside" dataTestId="onchain-meta">
      <div className="lt-text-gray-500 divide-y dark:divide-gray-700">
        {isArweaveHash ? (
          <Meta
            name={t`ARWEAVE TRANSACTION`}
            uri={`https://arweave.app/tx/${hash}`}
            hash={hash}
          />
        ) : null}
        {publication?.isDataAvailability ? (
          <Meta
            name={t`MOMOKA PROOF`}
            uri={`https://momoka.lens.xyz/tx/${publication.dataAvailabilityProofs
              ?.split('/')
              .pop()}`}
            hash={
              publication.dataAvailabilityProofs?.split('/').pop() as string
            }
          />
        ) : null}
        {isIPFSHash ? (
          <Meta
            name="IPFS TRANSACTION"
            uri={`${IPFS_GATEWAY}${hash}`}
            hash={hash}
          />
        ) : null}
        {collectNftAddress ? (
          <Meta
            name={t`NFT ADDRESS`}
            uri={`${POLYGONSCAN_URL}/token/${collectNftAddress}`}
            hash={collectNftAddress}
          />
        ) : null}
      </div>
    </Card>
  );
};

export default OnchainMeta;
