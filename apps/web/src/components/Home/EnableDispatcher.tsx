import ToggleDispatcher from '@components/Settings/Dispatcher/ToggleDispatcher';
import { HandIcon } from '@heroicons/react/outline';
import { APP_NAME, OLD_LENS_RELAYER_ADDRESS } from '@lenster/data/constants';
import getIsDispatcherEnabled from '@lenster/lib/getIsDispatcherEnabled';
import { Card } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

const EnableDispatcher: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isDispatcherEnabled = getIsDispatcherEnabled(currentProfile);
  const isOldDispatcherEnabled =
    currentProfile?.dispatcher?.address?.toLocaleLowerCase() ===
    OLD_LENS_RELAYER_ADDRESS.toLocaleLowerCase();

  const getDescription = () => {
    if (isOldDispatcherEnabled) {
      return (
        <Trans>
          Upgrade your dispatcher to the latest version for better, faster,
          stronger signless transactions.
        </Trans>
      );
    }
    return (
      <Trans>
        You can enable dispatcher to interact with {APP_NAME} without signing
        any of your transactions.
      </Trans>
    );
  };

  const getTitle = () => {
    if (isOldDispatcherEnabled) {
      return <Trans>Signless Transactions Upgrade</Trans>;
    }
    return <Trans>Signless Transactions</Trans>;
  };

  if (isDispatcherEnabled) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="border-brand-400 !bg-brand-300/20 text-brand-600 mb-4 space-y-2.5 p-5"
    >
      <div className="flex items-center space-x-2 font-bold">
        <HandIcon className="h-5 w-5" />
        <p>{getTitle()}</p>
      </div>
      <p className="text-sm leading-[22px]">{getDescription()}</p>
      <ToggleDispatcher buttonSize="sm" />
    </Card>
  );
};

export default EnableDispatcher;
