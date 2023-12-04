import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { AnyPublication } from '@hey/lens';
import humanize from '@hey/lib/humanize';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { type FC } from 'react';

interface CommentProps {
  publication: AnyPublication;
  showCount: boolean;
}

const Comment: FC<CommentProps> = ({ publication, showCount }) => {
  const { push } = useRouter();
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const count = targetPublication.stats.comments;
  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <div className="ld-text-gray-500 flex items-center space-x-1">
      <motion.button
        className="rounded-full p-1.5 outline-offset-2 outline-gray-400 hover:bg-gray-300/20"
        whileTap={{ scale: 0.9 }}
        aria-label="Comment"
        onClick={() => {
          push(`/posts/${publication.id}`);
        }}
      >
        <Tooltip
          placement="top"
          content={count > 0 ? `${humanize(count)} Comments` : 'Comment'}
          withDelay
        >
          <ChatBubbleLeftRightIcon className={iconClassName} />
        </Tooltip>
      </motion.button>
      {count > 0 && !showCount ? (
        <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
      ) : null}
    </div>
  );
};

export default Comment;
