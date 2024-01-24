import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import formatDate from '@hey/lib/datetime/formatDate';
import getAppName from '@hey/lib/getAppName';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import pushToImpressions from '@lib/pushToImpressions';
import { useEffectOnce } from 'usehooks-ts';

import PublicationActions from './Actions';
import FeaturedGroup from './FeaturedGroup';
import HiddenPublication from './HiddenPublication';
import PublicationAvatar from './PublicationAvatar';
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

  const { createdAt, metadata, publishedOn } = targetPublication;

  useEffectOnce(() => {
    pushToImpressions(targetPublication.id);
  });

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
                contentClassName="text-[17px]"
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
              <PublicationActions publication={targetPublication} showCount />
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default FullPublication;
