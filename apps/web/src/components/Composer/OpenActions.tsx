import type { UnknownOpenActionModuleSettings } from '@hey/lens';
import type { FC } from 'react';

import SwapOpenAction from '@components/Publication/OpenAction/UnknownModule/Swap';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';

const OpenActions: FC = () => {
  const { openAction, reset } = useOpenActionStore();

  const hasSwapOpenAction =
    openAction?.address === VerifiedOpenActionModules.Swap;

  if (!hasSwapOpenAction) {
    return null;
  }

  return (
    <div className="relative m-5 w-fit">
      <SwapOpenAction
        module={
          {
            contract: { address: openAction.address },
            initializeCalldata: openAction.data
          } as UnknownOpenActionModuleSettings
        }
      />
      <div className="absolute -right-5 -top-5 m-2">
        <button
          className="rounded-full bg-gray-900 p-1.5 opacity-75"
          onClick={() => reset()}
          type="button"
        >
          <XMarkIcon className="size-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default OpenActions;
