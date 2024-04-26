import type { FC } from 'react';

import { APP_NAME } from '@hey/data/constants';
import checkDispatcherPermissions from '@hey/helpers/checkDispatcherPermissions';
import { Card, CardHeader } from '@hey/ui';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import ToggleLensManager from './ToggleLensManager';

const LensManager: FC = () => {
  const { currentProfile } = useProfileStore();
  const { canUseSignless } = checkDispatcherPermissions(currentProfile);

  return (
    <Card>
      <CardHeader
        body={`You can enable Lens manager to interact with ${APP_NAME} without
        signing any of your transactions.`}
        title={
          canUseSignless
            ? 'Disable signless transactions'
            : 'Signless transactions'
        }
      />
      <div className="m-5">
        <ToggleLensManager />
      </div>
    </Card>
  );
};

export default LensManager;
