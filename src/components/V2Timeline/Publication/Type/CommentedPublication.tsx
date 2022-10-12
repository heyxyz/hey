import Slug from '@components/Shared/Slug';
import type { FeedItemRoot } from '@generated/types';
import { ChatAlt2Icon } from '@heroicons/react/outline';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  publication: FeedItemRoot;
}

const CommentedPublication: FC<Props> = ({ publication }) => {
  const sourceId = publication?.id;
  const sourceProfileHandle = publication?.profile?.handle;

  return (
    <div className="flex items-center pb-4 space-x-1 text-gray-500 text-[13px]">
      <ChatAlt2Icon className="w-4 h-4" />
      <Link href={`/posts/${sourceId}`}>Commented on {publication?.__typename?.toLowerCase()} by</Link>
      <Link href={`/u/${sourceProfileHandle}`}>
        <Slug slug={sourceProfileHandle} prefix="@" />
      </Link>
    </div>
  );
};

export default CommentedPublication;
