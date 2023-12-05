import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import humanize from '@hey/lib/humanize';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

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
        aria-label="Comment"
        className="rounded-full p-1.5 outline-offset-2 outline-gray-400 hover:bg-gray-300/20"
        onClick={() => {
          push(`/posts/${publication.id}`);
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Tooltip
          content={count > 0 ? `${humanize(count)} Comments` : 'Comment'}
          placement="top"
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
