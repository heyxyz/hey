import type { FC } from 'react';

import ToggleLensManager from '@components/Settings/Manager/LensManager/ToggleLensManager';
import { APP_NAME } from '@hey/data/constants';
import checkDispatcherPermissions from '@hey/helpers/checkDispatcherPermissions';
import { Card } from '@hey/ui';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useAccount } from 'wagmi';

const EnableLensManager: FC = () => {
  const { currentProfile } = useProfileStore();
  const { address } = useAccount();
  const { canUseSignless } = checkDispatcherPermissions(currentProfile);

  if (canUseSignless || currentProfile?.ownedBy.address !== address) {
    return null;
  }

  return (
    <Card as="aside" className="mb-4 space-y-2.5 p-5">
      <p className="text-lg font-bold">Signless transactions</p>
      <p className="text-sm leading-[22px]">
        You can enable Lens manager to interact with {APP_NAME} without signing
        any of your transactions.
      </p>
      <ToggleLensManager buttonSize="sm" />
    </Card>
  );
};

export default EnableLensManager;
