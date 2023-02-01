import Slug from '@components/Shared/Slug';
import Username from '@components/Shared/Username';
import { CollectionIcon } from '@heroicons/react/outline';
import formatAddress from '@lib/formatAddress';
import { Trans } from '@lingui/macro';
import { POLYGONSCAN_URL } from 'data/constants';
import type { Comment, Post } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  publication: Post | Comment;
}

const Collected: FC<Props> = ({ publication }) => {
  return (
    <div className="lt-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]">
      <CollectionIcon className="h-4 w-4" />
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
        <span>
          <Trans>
            collected the <b>{publication.__typename?.toLowerCase()}</b>
          </Trans>
        </span>
      </Link>
    </div>
  );
};

export default Collected;
