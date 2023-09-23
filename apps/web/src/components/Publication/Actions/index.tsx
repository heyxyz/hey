import type { AnyPublication } from '@lenster/lens';
import { isMirrorPublication } from '@lenster/lib/publicationHelpers';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { usePreferencesStore } from 'src/store/preferences';

import Collect from './Collect';
import Comment from './Comment';
import Like from './Like';
import Mod from './Mod';
import ShareMenu from './Share';

interface PublicationActionsProps {
  publication: AnyPublication;
  showCount?: boolean;
}

const PublicationActions: FC<PublicationActionsProps> = ({
  publication,
  showCount = false
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const currentProfile = useAppStore((state) => state.currentProfile);
  const gardenerMode = usePreferencesStore((state) => state.gardenerMode);
  const collectModuleType = publication?.collectModule.__typename;
  const canMirror = currentProfile
    ? targetPublication.operations.canMirror
    : true;

  return (
    <span
      className="-ml-2 mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 sm:gap-8"
      onClick={stopEventPropagation}
      aria-hidden="true"
    >
      <Comment publication={publication} showCount={showCount} />
      {canMirror ? (
        <ShareMenu publication={publication} showCount={showCount} />
      ) : null}
      <Like publication={publication} showCount={showCount} />
      {collectModuleType !== 'RevertCollectModuleSettings' ? (
        <Collect publication={publication} showCount={showCount} />
      ) : null}
      {gardenerMode ? (
        <Mod publication={publication} isFullPublication={showCount} />
      ) : null}
    </span>
  );
};

export default PublicationActions;
