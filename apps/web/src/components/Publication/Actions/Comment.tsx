import { ChatAlt2Icon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { Publication } from 'lens';
import humanize from 'lib/humanize';
import nFormatter from 'lib/nFormatter';
import Link from 'next/link';
import type { FC } from 'react';
import { Tooltip } from 'ui';

interface CommentProps {
  publication: Publication;
  showCount: boolean;
}

const Comment: FC<CommentProps> = ({ publication, showCount }) => {
  const count =
    publication.__typename === 'Mirror'
      ? publication?.mirrorOf?.stats?.totalAmountOfComments
      : publication?.stats?.totalAmountOfComments;
  const iconClassName = showCount ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <div className="flex items-center space-x-1 text-blue-500">
      <motion.button whileTap={{ scale: 0.9 }} aria-label="Comment">
        <Link href={`/posts/${publication.id}`}>
          <div className="rounded-full p-1.5 hover:bg-blue-300 hover:bg-opacity-20">
            <Tooltip
              placement="top"
              content={count > 0 ? t`${humanize(count)} Comments` : t`Comment`}
              withDelay
            >
              <ChatAlt2Icon className={iconClassName} />
            </Tooltip>
          </div>
        </Link>
      </motion.button>
      {count > 0 && !showCount && <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>}
    </div>
  );
};

export default Comment;
