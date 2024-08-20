import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import PublicationWrapper from '@components/Shared/PublicationWrapper';
import usePushToImpressions from 'src/hooks/usePushToImpressions';

import PublicationActions from './Actions';
import HiddenPublication from './HiddenPublication';
import PublicationAvatar from './PublicationAvatar';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';

interface ThreadBodyProps {
  publication: AnyPublication;
}

const ThreadBody: FC<ThreadBodyProps> = ({ publication }) => {
  usePushToImpressions(publication.id);

  const isComment =
    publication.__typename === 'Comment' && publication.commentOn;
  const replyLikes =
    isComment && publication.stats ? publication.stats.reactions : undefined;
  const originalLikes =
    isComment && publication.commentOn && publication.commentOn.stats
      ? publication.commentOn.stats.reactions
      : undefined;

  if (replyLikes === undefined || originalLikes === undefined) {
    console.error('Missing stats data on publication or its parent.');
    return null; // Or handle this case differently, perhaps showing a fallback UI.
  }

  const ratioPercentage =
    originalLikes > 0 ? (replyLikes / originalLikes) * 100 : 0;
  const isRatio = ratioPercentage > 100;
  const isApproachingRatio = ratioPercentage >= 50 && ratioPercentage <= 100;

  return (
    <PublicationWrapper publication={publication}>
      <div className="relative flex items-start space-x-3 pb-3">
        <PublicationAvatar publication={publication} />
        <div className="absolute bottom-0 left-[9.1px] h-full border-[0.9px] border-solid border-gray-300 dark:border-gray-700" />
        <div className="w-[calc(100%-55px)]">
          <PublicationHeader publication={publication} />
          {publication.isHidden ? (
            <HiddenPublication type={publication.__typename} />
          ) : (
            <>
              <PublicationBody publication={publication} />
              <PublicationActions publication={publication} />
            </>
          )}
        </div>
      </div>
      {isRatio && (
        <div className="mt-2 text-center font-bold text-green-500">
          😏🎉 This is a ratio 🎉😏
        </div>
      )}
      {isApproachingRatio && (
        <div className="mt-2 text-center font-bold text-yellow-500">
          {Math.floor(ratioPercentage)}% until ratioing 😏👀
        </div>
      )}
    </PublicationWrapper>
  );
};

export default ThreadBody;
