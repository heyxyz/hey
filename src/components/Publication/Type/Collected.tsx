import Slug from '@components/Shared/Slug';
import { Comment, Post } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import formatAddress from '@lib/formatAddress';
import Link from 'next/link';
import { FC } from 'react';
import { POLYGONSCAN_URL } from 'src/constants';

interface Props {
  publication: Post | Comment;
}

const Collected: FC<Props> = ({ publication }) => {
  return (
    <div className="flex items-center pb-4 space-x-1 text-gray-500 text-[13px]">
      <CollectionIcon className="w-4 h-4" />
      <div className="space-x-1">
        {publication?.collectedBy?.defaultProfile ? (
          <Link href={`/u/${publication?.collectedBy?.defaultProfile?.handle}`}>
            {publication?.collectedBy?.defaultProfile?.name ? (
              <b>{publication?.collectedBy?.defaultProfile?.name}</b>
            ) : (
              <Slug slug={publication?.collectedBy?.defaultProfile?.handle} prefix="@" />
            )}
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
        <Link href={`/posts/${publication?.id}`}>
          <span>collected the </span>
          <b>{publication.__typename?.toLowerCase()}</b>
        </Link>
      </div>
    </div>
  );
};

export default Collected;
