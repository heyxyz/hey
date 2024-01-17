import type { FC } from 'react';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { OpenAction } from '@hey/data/enums';
import {
  ScreenType,
  useOpenActionStore
} from 'src/store/non-persisted/publication/useOpenActionStore';

import OpenActionItem from './OpenActionItem';
import OpenActionsConfig from './OpenActionsConfig';
import SaveOrCancel from './SaveOrCancel';

const OpenActionsList: FC = () => {
  const setShowModal = useOpenActionStore((state) => state.setShowModal);
  const screen = useOpenActionStore((state) => state.screen);
  const selectedOpenAction = useOpenActionStore(
    (state) => state.selectedOpenAction
  );

  return (
    <div>
      {screen === ScreenType.List ? (
        <div className="p-5">
          <OpenActionItem
            description="Add ability to tip"
            icon={<CurrencyDollarIcon className="size-6" />}
            selected={selectedOpenAction === OpenAction.Tip}
            title="Tipping"
            type={OpenAction.Tip}
          />
          <SaveOrCancel
            onSave={() => setShowModal(false)}
            saveDisabled={selectedOpenAction === null}
          />
        </div>
      ) : selectedOpenAction ? (
        <OpenActionsConfig />
      ) : null}
    </div>
  );
};

export default OpenActionsList;
