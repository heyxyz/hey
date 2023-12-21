import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import {
  ARWEAVE_GATEWAY,
  IPFS_GATEWAY,
  POLYGONSCAN_URL
} from '@hey/data/constants';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Card } from '@hey/ui';
import Link from 'next/link';
import urlcat from 'urlcat';

interface MetaProps {
  hash: string;
  name: string;
  uri: string;
}

const Meta: FC<MetaProps> = ({ hash, name, uri }) => (
  <div className="px-5 py-3">
    <Link
      className="space-y-1"
      href={uri}
      rel="noreferrer noopener"
      target="_blank"
    >
      <div className="flex items-center space-x-1">
        <div className="text-[10px]">{name}</div>
        <ArrowTopRightOnSquareIcon className="size-4" />
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
  const isArweaveHash = hash?.length === 43;
  const isIPFSHash = hash?.length === 46 || hash?.length === 59;

  if (!isArweaveHash && !isIPFSHash) {
    return null;
  }

  return (
    <Card as="aside">
      <div className="ld-text-gray-500 divide-y dark:divide-gray-700">
        {isArweaveHash ? (
          <Meta
            hash={hash}
            name="ARWEAVE TRANSACTION"
            uri={urlcat(`${ARWEAVE_GATEWAY}/:hash`, { hash })}
          />
        ) : null}
        {publication?.momoka?.proof ? (
          <Meta
            hash={publication.momoka.proof?.split('/').pop() as string}
            name="MOMOKA PROOF"
            uri={`https://momoka.lens.xyz/tx/${publication.momoka.proof
              ?.split('/')
              .pop()}`}
          />
        ) : null}
        {isIPFSHash ? (
          <Meta
            hash={hash}
            name="IPFS TRANSACTION"
            uri={`${IPFS_GATEWAY}${hash}`}
          />
        ) : null}
        {publication?.txHash ? (
          <Meta
            hash={publication.txHash}
            name="TRANSACTION"
            uri={`${POLYGONSCAN_URL}/tx/${publication.txHash
              ?.split('/')
              .pop()}`}
          />
        ) : null}
      </div>
    </Card>
  );
};

export default OnchainMeta;
