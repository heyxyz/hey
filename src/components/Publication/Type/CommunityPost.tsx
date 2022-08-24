import Slug from '@components/Shared/Slug';
import { LensterPublication } from '@generated/lenstertypes';
import { UsersIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React, { FC } from 'react';

interface Props {
  publication: LensterPublication;
}

const CommunityPublication: FC<Props> = ({ publication }) => {
  const commentOn = publication?.commentOn;

  return (
    <div className="flex items-center pb-4 space-x-1 text-gray-500 text-[13px]">
      <UsersIcon className="w-4 h-4" />
      <div className="flex items-center space-x-1">
        <Link href={`/communities/${commentOn?.id}`}>
          <a href={`/communities/${commentOn?.id}`}>
            <span>Posted on </span>
            <Slug slug={publication?.commentOn?.metadata?.name as string} />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CommunityPublication;
