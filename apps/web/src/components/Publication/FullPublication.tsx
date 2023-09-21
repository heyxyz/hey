import type { AnyPublication } from '@lenster/lens';
import getAppName from '@lenster/lib/getAppName';
import { isMirrorPublication } from '@lenster/lib/publicationTypes';
import { formatDate, formatTime } from '@lib/formatTime';
import type { FC } from 'react';

import PublicationActions from './Actions';
import FeaturedChannel from './FeaturedChannel';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import PublicationStats from './PublicationStats';
import PublicationType from './Type';

interface FullPublicationProps {
  publication: AnyPublication;
}

const FullPublication: FC<FullPublicationProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const { metadata, createdAt, stats } = targetPublication;

  // Count check to show the publication stats only if the publication has a comment, like or collect
  const mirrorCount = stats.mirrors;
  const reactionCount = stats.reactions;
  const collectCount = stats.countOpenActions;
  const showStats = mirrorCount > 0 || reactionCount > 0 || collectCount > 0;

  return (
    <article className="p-5" data-testid={`publication-${publication.id}`}>
      <PublicationType publication={targetPublication} showType />
      <div>
        <PublicationHeader publication={targetPublication} />
        <div className="ml-[53px]">
          {publication.isHidden ? (
            <HiddenPublication type={publication.__typename} />
          ) : (
            <>
              <PublicationBody publication={targetPublication} />
              <div className="flex items-center gap-x-3">
                <div className="lt-text-gray-500 my-3 text-sm">
                  <span title={formatTime(createdAt)}>
                    {formatDate(new Date(createdAt), 'hh:mm A · MMM D, YYYY')}
                  </span>
                  {metadata.appId ? (
                    <span> · Posted via {getAppName(metadata.appId)}</span>
                  ) : null}
                </div>
                <FeaturedChannel tags={metadata.tags} />
              </div>
              {showStats ? (
                <>
                  <div className="divider" />
                  <PublicationStats publication={targetPublication} />
                </>
              ) : null}
              <div className="divider" />
              <PublicationActions publication={targetPublication} showCount />
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default FullPublication;
