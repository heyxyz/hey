import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import {
  ARWEAVE_GATEWAY,
  IPFS_GATEWAY,
  POLYGONSCAN_URL
} from '@hey/data/constants';
import type { AnyPublication } from '@hey/lens';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Card } from '@hey/ui';
import { type FC } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import urlcat from 'urlcat';

interface MetaProps {
  name: string;
  uri: string;
  hash: string;
}

const Meta: FC<MetaProps> = ({ name, uri, hash }) => (
  <div className="px-5 py-3">
    <Link
      to={uri}
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
            name="ARWEAVE TRANSACTION"
            uri={urlcat(`${ARWEAVE_GATEWAY}/:hash`, { hash })}
            hash={hash}
          />
        ) : null}
        {publication?.momoka?.proof ? (
          <Meta
            name="MOMOKA PROOF"
            uri={`https://momoka.lens.xyz/tx/${publication.momoka.proof
              ?.split('/')
              .pop()}`}
            hash={publication.momoka.proof?.split('/').pop() as string}
          />
        ) : null}
        {isIPFSHash ? (
          <Meta
            name="IPFS TRANSACTION"
            uri={`${IPFS_GATEWAY}${hash}`}
            hash={hash}
          />
        ) : null}
        {publication?.txHash ? (
          <Meta
            name="TRANSACTION"
            uri={`${POLYGONSCAN_URL}/tx/${publication.txHash
              ?.split('/')
              .pop()}`}
            hash={publication.txHash}
          />
        ) : null}
      </div>
    </Card>
  );
};

export default OnchainMeta;
