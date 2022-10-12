import Slug from '@components/Shared/Slug';
import type { Comment } from '@generated/types';
import { ChatAlt2Icon } from '@heroicons/react/outline';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  comments: Array<Comment>;
}

const CommentedPublication: FC<Props> = ({ comments }) => {
  const profile = comments[0].profile;

  return (
    <div className="flex items-center pb-4 space-x-1 text-gray-500 text-[13px]">
      <ChatAlt2Icon className="w-4 h-4" />
      <Link href={`/u/${profile?.handle}`} className="max-w-xs truncate">
        {profile?.name ? <b>{profile?.name}</b> : <Slug slug={profile?.handle} prefix="@" />}
      </Link>
      <span> and {comments.length - 1} others commented</span>
    </div>
  );
};

export default CommentedPublication;
