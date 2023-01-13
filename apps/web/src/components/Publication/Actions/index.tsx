import { Tooltip } from '@components/UI/Tooltip';
import type { LensterPublication } from '@generated/types';
import { LockClosedIcon } from '@heroicons/react/solid';
import { t } from '@lingui/macro';
import type { ElectedMirror } from 'lens';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

import Analytics from './Analytics';
import Collect from './Collect';
import Comment from './Comment';
import Like from './Like';
import Mirror from './Mirror';

interface Props {
  publication: LensterPublication;
  electedMirror?: ElectedMirror;
}

const PublicationActions: FC<Props> = ({ publication, electedMirror }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const collectModuleType = publication?.collectModule.__typename;
  const canMirror = currentProfile ? publication?.canMirror?.result : true;

  return (
    <div className="flex items-center justify-between pt-3 -ml-2">
      <span
        className="flex items-center gap-6 sm:gap-8"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Comment publication={publication} />
        {canMirror && <Mirror publication={publication} />}
        <Like publication={publication} />
        {collectModuleType !== 'RevertCollectModuleSettings' && (
          <Collect electedMirror={electedMirror} publication={publication} />
        )}
        <Analytics publication={publication} />
      </span>
      {publication.isGated && (
        <Tooltip placement="top" content={t`Gated Publication`}>
          <LockClosedIcon className="h-4 w-4 text-green-500" />
        </Tooltip>
      )}
    </div>
  );
};

export default PublicationActions;
