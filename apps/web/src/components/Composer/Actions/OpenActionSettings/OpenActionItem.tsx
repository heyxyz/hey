import type { OpenAction } from '@hey/data/enums';
import type { FC, ReactNode } from 'react';

import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { Card } from '@hey/ui';
import {
  ScreenType,
  useOpenActionStore
} from 'src/store/non-persisted/publication/useOpenActionStore';

interface OpenActionItemProps {
  description: string;
  icon: ReactNode;
  title: string;
  type: OpenAction;
}

const OpenActionItem: FC<OpenActionItemProps> = ({
  description,
  icon,
  title,
  type
}) => {
  const { setScreen, setSelectedOpenAction } = useOpenActionStore();

  const onOpenActionSelected = (name: OpenAction) => {
    setScreen(ScreenType.Config);
    setSelectedOpenAction(name);
  };

  return (
    <Card
      className="flex cursor-pointer items-center justify-between px-5 py-3"
      forceRounded
      onClick={() => onOpenActionSelected(type)}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <div className="space-y-1">
          <div className="font-bold">{title}</div>
          <div className="text-sm">{description}</div>
        </div>
      </div>
      <ChevronRightIcon className="size-5 text-gray-400" />
    </Card>
  );
};

export default OpenActionItem;
