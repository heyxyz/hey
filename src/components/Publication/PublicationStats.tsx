import { LensterPublication } from '@generated/lenstertypes';
import nFormatter from '@lib/nFormatter';
import React, { FC } from 'react';

interface Props {
  publication: LensterPublication;
}

const PublicationStats: FC<Props> = ({ publication }) => {
  const publicationType = publication?.metadata?.attributes[0]?.value;
  const isMirror = publication?.__typename === 'Mirror';
  const reactionCount = isMirror
    ? publication?.mirrorOf?.stats?.totalUpvotes
    : publication?.stats?.totalUpvotes;
  const mirrorCount = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfMirrors
    : publication?.stats?.totalAmountOfMirrors;
  const collectCount = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfCollects
    : publication?.stats?.totalAmountOfCollects;

  return publicationType !== 'community' ? (
    <div className="flex flex-wrap gap-6 text-sm items-center py-3 text-gray-500 sm:gap-8">
      <button>
        <b className="text-black dark:text-white">{nFormatter(mirrorCount)}</b> Mirrors
      </button>
      <button>
        <b className="text-black dark:text-white">{nFormatter(reactionCount)}</b> Likes
      </button>
      <button>
        <b className="text-black dark:text-white">{nFormatter(collectCount)}</b> Collects
      </button>
    </div>
  ) : null;
};

export default PublicationStats;
