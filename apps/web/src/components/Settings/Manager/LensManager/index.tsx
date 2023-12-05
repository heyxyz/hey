import type { FC } from 'react';

import { APP_NAME } from '@hey/data/constants';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import { Card } from '@hey/ui';
import useProfileStore from 'src/store/persisted/useProfileStore';

import ToggleLensManager from './ToggleLensManager';

const LensManager: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { canUseSignless } = checkDispatcherPermissions(currentProfile);

  return (
    <Card className="linkify space-y-2 p-5">
      <div className="space-y-3 pb-2">
        <div className="text-lg font-bold">
          {canUseSignless
            ? 'Disable signless transactions'
            : 'Signless transactions'}
        </div>
        <p>
          You can enable Lens manager to interact with {APP_NAME} without
          signing any of your transactions.
        </p>
      </div>
      <ToggleLensManager />
    </Card>
  );
};

export default LensManager;
