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
      <div>
        <PublicationHeader publication={targetPublication} />
        <div className="ml-[53px]">
          {targetPublication.isHidden ? (
            <HiddenPublication type={targetPublication.__typename} />
          ) : (
            <>
              <PublicationBody publication={targetPublication} />
              <div className="flex items-center gap-x-3">
                <div className="ld-text-gray-500 my-3 text-sm">
                  <span>{formatDate(createdAt, 'hh:mm A · MMM D, YYYY')}</span>
                  {publishedOn?.id ? (
                    <span> · Posted via {getAppName(publishedOn.id)}</span>
                  ) : null}
                </div>
                <FeaturedGroup tags={metadata.tags} />
              </div>
              <PublicationStats publication={targetPublication} />
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
