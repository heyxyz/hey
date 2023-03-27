import useModMode from '@components/utils/hooks/useModMode';
import type { ElectedMirror, Publication } from 'lens';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

import Analytics from './Analytics';
import Collect from './Collect';
import Comment from './Comment';
import Like from './Like';
import Mirror from './Mirror';
import Mod from './Mod';

interface PublicationActionsProps {
  publication: Publication;
  electedMirror?: ElectedMirror;
  showCount?: boolean;
}

const PublicationActions: FC<PublicationActionsProps> = ({
  publication,
  electedMirror,
  showCount = false
}) => {
  const { allowed: modMode } = useModMode();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const collectModuleType = publication?.collectModule.__typename;
  const canMirror = currentProfile ? publication?.canMirror?.result : true;

  return (
    <span className="-ml-2 flex items-center gap-6 pt-3 sm:gap-8" onClick={stopEventPropagation}>
      <Comment publication={publication} showCount={showCount} />
      {canMirror && <Mirror publication={publication} showCount={showCount} />}
      <Like publication={publication} showCount={showCount} />
      {collectModuleType !== 'RevertCollectModuleSettings' && (
        <Collect electedMirror={electedMirror} publication={publication} showCount={showCount} />
      )}
      {modMode && <Mod publication={publication} isFullPublication={showCount} />}
      <Analytics publication={publication} />
    </span>
  );
};

export default PublicationActions;
