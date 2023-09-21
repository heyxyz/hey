import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { AnyPublication } from '@lenster/lens';
import humanize from '@lenster/lib/humanize';
import nFormatter from '@lenster/lib/nFormatter';
import { isMirrorPublication } from '@lenster/lib/publicationTypes';
import { Tooltip } from '@lenster/ui';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { FC } from 'react';

interface CommentProps {
  publication: AnyPublication;
  showCount: boolean;
}

const Comment: FC<CommentProps> = ({ publication, showCount }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const count = targetPublication.stats.comments;
  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <div className="flex items-center space-x-1 text-blue-500">
      <motion.button whileTap={{ scale: 0.9 }} aria-label="Comment">
        <Link href={`/posts/${publication.id}`}>
          <div className="rounded-full p-1.5 hover:bg-blue-300/20">
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
