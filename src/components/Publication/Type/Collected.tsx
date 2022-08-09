import Slug from '@components/Shared/Slug';
import { LensterPublication } from '@generated/lenstertypes';
import { CollectionIcon } from '@heroicons/react/outline';
import formatAddress from '@lib/formatAddress';
import Link from 'next/link';
import React, { FC } from 'react';
import { POLYGONSCAN_URL } from 'src/constants';

interface Props {
  publication: LensterPublication;
  type: string;
}

const Collected: FC<Props> = ({ publication, type }) => {
  return (
    <div className="flex items-center pb-4 space-x-1 text-gray-500 text-[13px]">
      <CollectionIcon className="w-4 h-4" />
      <div className="flex items-center space-x-1">
        <div>{type} by</div>
        {publication?.collectedBy?.defaultProfile ? (
          <Link href={`/u/${publication?.collectedBy?.defaultProfile?.handle}`}>
            <a href={`/u/${publication?.collectedBy?.defaultProfile?.handle}`}>
              <Slug slug={publication?.collectedBy?.defaultProfile?.handle} prefix="@" />
            </a>
          </Link>
        ) : (
          <a
            href={`${POLYGONSCAN_URL}/address/${publication?.collectedBy?.address}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Slug slug={formatAddress(publication?.collectedBy?.address)} />
          </a>
        )}
      </div>
    </div>
  );
};

export default Collected;
