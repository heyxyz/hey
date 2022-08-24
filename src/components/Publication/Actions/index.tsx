import { LensterPublication } from '@generated/lenstertypes';
import clsx from 'clsx';
import React, { FC, MouseEvent } from 'react';

import Collect from './Collect';
import Comment from './Comment';
import Like from './Like';
import PublicationMenu from './Menu';
import Mirror from './Mirror';

interface Props {
  publication: LensterPublication;
  isFullPublication?: boolean;
}

const PublicationActions: FC<Props> = ({ publication, isFullPublication = false }) => {
  const publicationType = publication?.metadata?.attributes[0]?.value;

  return (
    <div
      className={clsx(
        { 'justify-between': isFullPublication },
        'flex gap-6 items-center pt-3 -ml-2 text-gray-500 sm:gap-8'
      )}
      onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
    >
      <Comment publication={publication} isFullPublication={isFullPublication} />
      <Mirror publication={publication} isFullPublication={isFullPublication} />
      <Like publication={publication} isFullPublication={isFullPublication} />
      {publication?.collectModule?.__typename !== 'RevertCollectModuleSettings' &&
        publicationType !== 'crowdfund' && (
          <Collect publication={publication} isFullPublication={isFullPublication} />
        )}
      <PublicationMenu publication={publication} isFullPublication={isFullPublication} />
    </div>
  );
};

export default PublicationActions;
