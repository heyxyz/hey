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
    </PublicationWrapper>
  );
};

export default ThreadBody;
