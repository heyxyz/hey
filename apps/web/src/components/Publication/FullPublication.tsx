import type { AnyPublication } from '@hey/lens';

import { QueueListIcon } from '@heroicons/react/24/outline';
import formatDate from '@hey/lib/datetime/formatDate';
import getAppName from '@hey/lib/getAppName';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import pushToImpressions from '@lib/pushToImpressions';
import { motion } from 'framer-motion';
import { type FC, useEffect } from 'react';

import { useHiddenCommentFeedStore } from '.';
import PublicationActions from './Actions';
import FeaturedGroup from './FeaturedGroup';
import HiddenPublication from './HiddenPublication';
import PublicationAvatar from './PublicationAvatar';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import PublicationStats from './PublicationStats';
import PublicationType from './Type';

interface FullPublicationProps {
  hasHiddenComments: boolean;
  publication: AnyPublication;
}

const FullPublication: FC<FullPublicationProps> = ({
  hasHiddenComments,
  publication
}) => {
  const showHiddenComments = useHiddenCommentFeedStore(
    (state) => state.showHiddenComments
  );
  const setShowHiddenComments = useHiddenCommentFeedStore(
    (state) => state.setShowHiddenComments
  );

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const { createdAt, metadata, publishedOn } = targetPublication;

  useEffect(() => {
    pushToImpressions(targetPublication.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className="p-5">
      <PublicationType publication={publication} showType />
      <div className="flex items-start space-x-3">
        <PublicationAvatar publication={publication} />
        <div className="w-[calc(100%-55px)]">
          <PublicationHeader publication={targetPublication} />
          {targetPublication.isHidden ? (
            <HiddenPublication type={targetPublication.__typename} />
          ) : (
            <>
              <PublicationBody
                contentClassName="full-page-publication-markup"
                publication={targetPublication}
              />
              <div className="flex items-center gap-x-3">
                <div className="ld-text-gray-500 my-3 text-sm">
                  <span>{formatDate(createdAt, 'hh:mm A · MMM D, YYYY')}</span>
                  {publishedOn?.id ? (
                    <span> · Posted via {getAppName(publishedOn.id)}</span>
                  ) : null}
                </div>
                <FeaturedGroup tags={metadata.tags} />
              </div>
              <PublicationStats
                publicationId={targetPublication.id}
                publicationStats={targetPublication.stats}
              />
              <div className="divider" />
              <div className="flex items-center justify-between">
                <PublicationActions publication={targetPublication} showCount />
                {hasHiddenComments ? (
                  <div className="mt-2">
                    <motion.button
                      aria-label="Like"
                      className={cn(
                        showHiddenComments
                          ? 'text-green-500 outline-green-500 hover:bg-green-300/20'
                          : 'ld-text-gray-500 outline-gray-400 hover:bg-gray-300/20',
                        'rounded-full p-1.5 outline-offset-2'
                      )}
                      onClick={() => setShowHiddenComments(!showHiddenComments)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Tooltip
                        content={
                          showHiddenComments
                            ? 'Hide hidden comments'
                            : 'Show hidden comments'
                        }
                        placement="top"
                        withDelay
                      >
                        <QueueListIcon className="size-5" />
                      </Tooltip>
                    </motion.button>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default FullPublication;
