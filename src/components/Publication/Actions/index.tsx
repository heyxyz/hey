import { LensterPublication } from '@generated/lenstertypes';
import clsx from 'clsx';
import React, { FC } from 'react';

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
  const collectModuleType = publication?.collectModule?.__typename;

  return (
    <span
      onClick={(event) => {
        event.stopPropagation();
      }}
      className={clsx(
        { 'justify-between': isFullPublication },
        'flex gap-6 items-center pt-3 -ml-2 text-gray-500 sm:gap-8'
      )}
    >
      <Comment publication={publication} isFullPublication={isFullPublication} />
      <Mirror publication={publication} isFullPublication={isFullPublication} />
      <Like publication={publication} isFullPublication={isFullPublication} />
      {collectModuleType !== 'RevertCollectModuleSettings' &&
        collectModuleType !== 'UnknownCollectModuleSettings' && // TODO: remove this check when we have a better way to handle unknown collect modules
        publicationType !== 'crowdfund' && (
          <Collect publication={publication} isFullPublication={isFullPublication} />
        )}
      <PublicationMenu publication={publication} isFullPublication={isFullPublication} />
    </span>
  );
};

export default PublicationActions;
