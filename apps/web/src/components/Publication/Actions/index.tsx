import { type AnyPublication } from '@hey/lens';
import isOpenActionAllowed from '@hey/lib/isOpenActionAllowed';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';

import OpenAction from '../LensOpenActions';
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
  const hasOpenAction = (targetPublication.openActionModules?.length || 0) > 0;

  const canMirror = currentProfile
    ? targetPublication.operations.canMirror
    : true;
  const canAct =
    hasOpenAction && isOpenActionAllowed(targetPublication.openActionModules);

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
      {canAct ? (
        <OpenAction publication={publication} showCount={showCount} />
      ) : null}
      {gardenerMode ? (
        <Mod publication={publication} isFullPublication={showCount} />
      ) : null}
    </span>
  );
};

export default PublicationActions;
