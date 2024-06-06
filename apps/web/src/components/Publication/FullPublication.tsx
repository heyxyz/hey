import type { AnyPublication } from '@good/lens';
import type { FC } from 'react';

import getProfileDetails from '@good/helpers/api/getProfileFlags';
import formatDate from '@good/helpers/datetime/formatDate';
import getAppName from '@good/helpers/getAppName';
import { isMirrorPublication } from '@good/helpers/publicationHelpers';
import { Card, Tooltip } from '@good/ui';
import cn from '@good/ui/cn';
import { QueueListIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import usePushToImpressions from 'src/hooks/usePushToImpressions';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

import { useHiddenCommentFeedStore } from '.';
import PublicationActions from './Actions';
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
  const { staffMode } = useFeatureFlagsStore();
  const { setShowHiddenComments, showHiddenComments } =
    useHiddenCommentFeedStore();

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const { by, createdAt, publishedOn } = targetPublication;

  usePushToImpressions(targetPublication.id);

  const { data: profileDetails } = useQuery({
    enabled: Boolean(by.id),
    queryFn: () => getProfileDetails(by.id || ''),
    queryKey: ['getProfileDetailsOnPublication', by.id]
  });

  const isSuspended = staffMode ? false : profileDetails?.isSuspended;

  if (isSuspended) {
    return (
      <Card className="m-5 !bg-gray-100 dark:!bg-gray-800" forceRounded>
        <div className="px-4 py-3 text-sm">
          Author Profile has been suspended!
        </div>
      </Card>
    );
  }

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
              <div className="ld-text-gray-500 my-3 text-sm">
                <span>{formatDate(createdAt, 'hh:mm A · MMM D, YYYY')}</span>
                {publishedOn?.id ? (
                  <span> · Posted via {getAppName(publishedOn.id)}</span>
                ) : null}
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
                          ? 'text-green-500 hover:bg-green-300/20'
                          : 'ld-text-gray-500 hover:bg-gray-300/20',
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
