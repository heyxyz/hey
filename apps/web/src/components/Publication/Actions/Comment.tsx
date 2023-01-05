import { Tooltip } from '@components/UI/Tooltip';
import type { LensterPublication } from '@generated/types';
import { ChatAlt2Icon } from '@heroicons/react/outline';
import humanize from '@lib/humanize';
import nFormatter from '@lib/nFormatter';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  publication: LensterPublication;
  isFullPublication: boolean;
}

const Comment: FC<Props> = ({ publication, isFullPublication }) => {
  const count =
    publication.__typename === 'Mirror'
      ? publication?.mirrorOf?.stats?.totalAmountOfComments
      : publication?.stats?.totalAmountOfComments;
  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <motion.button whileTap={{ scale: 0.9 }} aria-label="Comment">
      <Link href={`/posts/${publication.id}`}>
        <span className="flex items-center space-x-1 text-blue-500">
          <span className="p-1.5 rounded-full hover:bg-blue-300 hover:bg-opacity-20">
            <Tooltip
              placement="top"
              content={count > 0 ? t`${humanize(count)} Comments` : t`Comment`}
              withDelay
            >
              <ChatAlt2Icon className={iconClassName} />
            </Tooltip>
          </span>
          {count > 0 && !isFullPublication && (
            <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
          )}
        </span>
      </Link>
    </motion.button>
  );
};

export default Comment;
