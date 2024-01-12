import type { FC } from 'react';

import ToggleLensManager from '@components/Settings/Manager/LensManager/ToggleLensManager';
import { HandRaisedIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@hey/data/constants';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import { Card } from '@hey/ui';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useAccount } from 'wagmi';

const EnableLensManager: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { address } = useAccount();
  const { canUseSignless } = checkDispatcherPermissions(currentProfile);

  if (canUseSignless || currentProfile?.ownedBy.address !== address) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="border-brand-400 !bg-brand-300/20 text-brand-600 mb-4 space-y-2.5 p-5"
    >
      <div className="flex items-center space-x-2 font-bold">
        <HandRaisedIcon className="size-5" />
        <p>Signless transactions</p>
      </div>
      <p className="text-sm leading-[22px]">
        You can enable Lens manager to interact with {APP_NAME} without signing
        any of your transactions.
      </p>
      <ToggleLensManager buttonSize="sm" />
    </Card>
  );
};

export default EnableLensManager;
