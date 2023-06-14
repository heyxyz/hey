import { formatTime } from '@lib/formatTime';
import dayjs from 'dayjs';
import type { Publication } from 'lens';
import getAppName from 'lib/getAppName';
import { useState } from 'react';
import type { FC } from 'react';

import PublicationActions from './Actions';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import PublicationStats from './PublicationStats';
import PublicationType from './Type';

interface FullPublicationProps {
  publication: Publication;
}

const FullPublication: FC<FullPublicationProps> = ({ publication }) => {
  const isMirror = publication.__typename === 'Mirror';
  const timestamp = isMirror ? publication?.mirrorOf?.createdAt : publication?.createdAt;
  const [roundAddress, setRoundAddress] = useState('');

  // Count check to show the publication stats only if the publication has a comment, like or collect
  const mirrorCount = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfMirrors
    : publication?.stats?.totalAmountOfMirrors;
  const reactionCount = isMirror
    ? publication?.mirrorOf?.stats?.totalUpvotes
    : publication?.stats?.totalUpvotes;
  const collectCount = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfCollects
    : publication?.stats?.totalAmountOfCollects;
  const showStats = mirrorCount > 0 || reactionCount > 0 || collectCount > 0;

  return (
    <article className="p-5" data-testid={`publication-${publication.id}`}>
      <PublicationType publication={publication} showType />
      <div>
        <PublicationHeader publication={publication} />
        <div className="ml-[53px]">
          {publication?.hidden ? (
            <HiddenPublication type={publication.__typename} />
          ) : (
            <>
              <PublicationBody publication={publication} setRoundAddress={setRoundAddress} />
              <div className="lt-text-gray-500 my-3 text-sm">
                <span title={formatTime(timestamp)}>
                  {dayjs(new Date(timestamp)).format('hh:mm A · MMM D, YYYY')}
                </span>
                {publication?.appId ? <span> · Posted via {getAppName(publication?.appId)}</span> : null}
              </div>
              {showStats && (
                <>
                  <div className="divider" />
                  <PublicationStats publication={publication} />
                </>
              )}
              <div className="divider" />
              <PublicationActions publication={publication} showCount roundAddress={roundAddress} />
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default FullPublication;
