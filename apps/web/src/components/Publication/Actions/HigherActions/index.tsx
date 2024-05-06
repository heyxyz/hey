import type { MirrorablePublication } from '@hey/lens';
import type { FC } from 'react';

import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

import GardenerActions from './GardenerActions';
import StaffActions from './StaffActions';

interface HigherActionsProps {
  publication: MirrorablePublication;
}

const HigherActions: FC<HigherActionsProps> = ({ publication }) => {
  const { staffMode } = useFeatureFlagsStore();

  return (
    <div className="m-5">
      <GardenerActions publication={publication} />
      {staffMode && <StaffActions publication={publication} />}
    </div>
  );
};

export default HigherActions;
