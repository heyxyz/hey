import type { Dispatch, FC, SetStateAction } from 'react';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { OpenAction } from '@hey/data/enums';
import { Button } from '@hey/ui';
import { useState } from 'react';

import OpenActionItem from './OpenActionItem';
import OpenActionsConfig from './OpenActionsConfig';

export enum ScreenType {
  Config = 'CONFIG',
  List = 'LIST'
}

interface OpenActionsListProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const OpenActionsList: FC<OpenActionsListProps> = ({ setShowModal }) => {
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
            title="Tipping"
          />
        </div>
      ) : selectedOpenAction ? (
        <OpenActionsConfig name={selectedOpenAction} onBack={onBack} />
      ) : null}
      <div className="mt-5 flex space-x-2">
        <Button
          className="ml-auto"
          onClick={() => {
            setShowModal(false);
          }}
          outline
          variant="danger"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default OpenActionsList;
