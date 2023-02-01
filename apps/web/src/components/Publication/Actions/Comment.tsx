import { Tooltip } from '@components/UI/Tooltip';
import { ChatAlt2Icon } from '@heroicons/react/outline';
import humanize from '@lib/humanize';
import nFormatter from '@lib/nFormatter';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { Publication } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  publication: Publication;
  showCount: boolean;
}

const Comment: FC<Props> = ({ publication, showCount }) => {
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
