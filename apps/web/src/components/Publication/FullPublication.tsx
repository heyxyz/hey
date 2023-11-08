import type { AnyPublication } from '@hey/lens';
import getAppName from '@hey/lib/getAppName';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { formatDate } from '@lib/formatTime';
import { type FC } from 'react';
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

  const { metadata, createdAt } = targetPublication;

  useEffectOnce(() => {
    if (targetPublication.id && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PUBLICATION_VISIBLE',
        id: targetPublication.id
      });
    }
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
                  <span>
                    {formatDate(new Date(createdAt), 'hh:mm A · MMM D, YYYY')}
                  </span>
                  {metadata.appId ? (
                    <span> · Posted via {getAppName(metadata.appId)}</span>
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
