import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { Publication } from '@hey/lens';
import humanize from '@hey/lib/humanize';
import nFormatter from '@hey/lib/nFormatter';
import { Tooltip } from '@hey/ui';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { FC } from 'react';

interface CommentProps {
  publication: Publication;
  showCount: boolean;
}

const Comment: FC<CommentProps> = ({ publication, showCount }) => {
  const count =
    publication.__typename === 'Mirror'
      ? publication?.mirrorOf?.stats?.totalAmountOfComments
      : publication?.stats?.totalAmountOfComments;
  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <div className="lt-text-gray-500 flex items-center space-x-1">
      <motion.button whileTap={{ scale: 0.9 }} aria-label="Comment">
        <Link href={`/posts/${publication.id}`}>
          <div className="rounded-full p-1.5 hover:bg-gray-300/20">
            <Tooltip
              placement="top"
              content={count > 0 ? t`${humanize(count)} Comments` : t`Comment`}
              withDelay
            >
              <ChatBubbleLeftRightIcon className={iconClassName} />
            </Tooltip>
          </div>
        </Link>
      </motion.button>
      {count > 0 && !showCount ? (
        <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
      ) : null}
    </div>
  );
};

export default Comment;
