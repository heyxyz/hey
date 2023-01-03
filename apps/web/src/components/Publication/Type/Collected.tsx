import Slug from '@components/Shared/Slug';
import Username from '@components/Shared/Username';
import { CollectionIcon } from '@heroicons/react/outline';
import formatAddress from '@lib/formatAddress';
import { POLYGONSCAN_URL } from 'data/constants';
import type { Comment, Post } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  publication: Post | Comment;
}

const Collected: FC<Props> = ({ publication }) => {
  return (
    <div className="flex items-center pb-4 space-x-1 lt-text-gray-500 text-[13px]">
      <CollectionIcon className="w-4 h-4" />
      {publication?.collectedBy?.defaultProfile ? (
        <Username profile={publication?.collectedBy?.defaultProfile} className="max-w-xs truncate" />
      ) : (
        <a
          href={`${POLYGONSCAN_URL}/address/${publication?.collectedBy?.address}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Slug slug={formatAddress(publication?.collectedBy?.address)} />
        </a>
      )}
      <Link href={`/posts/${publication?.id}`}>
        <span>collected the </span>
        <b>{publication.__typename?.toLowerCase()}</b>
      </Link>
    </div>
  );
};

export default Collected;
