import { LensterPublication } from '@generated/lenstertypes';
import clsx from 'clsx';
import { FC } from 'react';
import { useAppStore } from 'src/store/app';

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
  const currentProfile = useAppStore((state) => state.currentProfile);
  const collectModuleType = publication?.collectModule.__typename;
  const canMirror = currentProfile ? publication?.canMirror?.result : true;

  return (
    <span
      className={clsx(
        { 'justify-between': isFullPublication },
        'flex gap-6 items-center pt-3 -ml-2 text-gray-500 sm:gap-8'
      )}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <Comment publication={publication} isFullPublication={isFullPublication} />
      {canMirror && <Mirror publication={publication} isFullPublication={isFullPublication} />}
      <Like publication={publication} isFullPublication={isFullPublication} />
      {collectModuleType !== 'RevertCollectModuleSettings' &&
        collectModuleType !== 'UnknownCollectModuleSettings' && (
          <Collect publication={publication} isFullPublication={isFullPublication} />
        )}
      <PublicationMenu publication={publication} isFullPublication={isFullPublication} />
    </span>
  );
};

export default PublicationActions;
