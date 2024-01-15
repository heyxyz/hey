import type { FC } from 'react';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { OpenAction } from '@hey/data/enums';
import { useState } from 'react';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';

import OpenActionItem from './OpenActionItem';
import OpenActionsConfig from './OpenActionsConfig';
import SaveOrCancel from './SaveOrCancel';

export enum ScreenType {
  Config = 'CONFIG',
  List = 'LIST'
}

const OpenActionsList: FC = () => {
  const { setShowModal } = useOpenActionStore();
  const [screen, setScreen] = useState<ScreenType>(ScreenType.List);
  const [selectedOpenAction, setSelectedOpenAction] =
    useState<null | OpenAction>(null);

  const onOpenActionSelected = (name: OpenAction) => {
    setScreen(ScreenType.Config);
    setSelectedOpenAction(name);
  };

  const onBack = () => {
    setScreen(ScreenType.List);
    setSelectedOpenAction(null);
  };

  return (
    <div className="p-5">
      {screen === ScreenType.List ? (
        <div>
          <OpenActionItem
            description="Add ability to tip"
            icon={<CurrencyDollarIcon className="size-6" />}
            onClick={() => onOpenActionSelected(OpenAction.Tip)}
            selected={selectedOpenAction === OpenAction.Tip}
            title="Tipping"
          />
          <SaveOrCancel onSave={() => setShowModal(false)} />
        </div>
      ) : selectedOpenAction ? (
        <OpenActionsConfig name={selectedOpenAction} onBack={onBack} />
      ) : null}
    </div>
  );
};

export default OpenActionsList;
