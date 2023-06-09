import useModMode from '@components/utils/hooks/useModMode';
import type { ElectedMirror, Publication } from 'lens';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

import Collect from './Collect';
import Comment from './Comment';
import Like from './Like';
import Mirror from './Mirror';
import Mod from './Mod';
import Tip from './Tip';

interface PublicationActionsProps {
  publication: Publication;
  electedMirror?: ElectedMirror;
  showCount?: boolean;
  tippingEnabled?: boolean;
}

const PublicationActions: FC<PublicationActionsProps> = ({
  publication,
  electedMirror,
  showCount = false,
  tippingEnabled = false
}) => {
  const { allowed: modMode } = useModMode();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const collectModuleType = publication?.collectModule.__typename;
  const canMirror = currentProfile ? publication?.canMirror?.result : true;

  return (
    <span
      className="-ml-2 flex flex-wrap items-center gap-x-6 gap-y-1 pt-3 sm:gap-8"
      onClick={stopEventPropagation}
      aria-hidden="true"
    >
      <Comment publication={publication} showCount={showCount} />
      {canMirror && <Mirror publication={publication} showCount={showCount} />}
      <Like publication={publication} showCount={showCount} />
      {collectModuleType !== 'RevertCollectModuleSettings' && (
        <Collect electedMirror={electedMirror} publication={publication} showCount={showCount} />
      )}
      {tippingEnabled && (
        <Tip electedMirror={electedMirror} publication={publication} showCount={showCount} />
      )}
      {modMode && <Mod publication={publication} isFullPublication={showCount} />}
    </span>
  );
};
export default PublicationActions;
