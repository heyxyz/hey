import type { FC } from 'react';

import { OpenAction } from '@hey/data/enums';
import { TipIcon } from '@hey/icons';
import {
  ScreenType,
  useOpenActionStore
} from 'src/store/non-persisted/publication/useOpenActionStore';

import OpenActionItem from './OpenActionItem';
import OpenActionsConfig from './OpenActionsConfig';
import SaveOrCancel from './SaveOrCancel';

const OpenActionsList: FC = () => {
  const { screen, selectedOpenAction, setShowModal } = useOpenActionStore();

  return screen === ScreenType.List ? (
    <div className="p-5">
      <OpenActionItem
        description="Add ability to tip"
        icon={<TipIcon className="size-6" />}
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
  ) : null;
};

export default OpenActionsList;
