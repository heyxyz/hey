import type { FC, ReactNode } from 'react';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Card } from '@hey/ui';

interface OpenActionItemProps {
  description: string;
  icon: ReactNode;
  onClick: () => void;
  selected: boolean;
  title: string;
}

const OpenActionItem: FC<OpenActionItemProps> = ({
  description,
  icon,
  onClick,
  selected,
  title
}) => {
  return (
    <Card
      className="flex cursor-pointer items-center justify-between p-5"
      forceRounded
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="text-brand-500">{icon}</div>
        <div className="space-y-1">
          <div className="font-bold">{title}</div>
          <div className="text-sm">{description}</div>
        </div>
      </div>
      {selected ? (
        <CheckCircleIcon className="size-5 text-green-500" />
      ) : (
        <ArrowRightIcon className="size-5 text-gray-400" />
      )}
    </Card>
  );
};

export default OpenActionItem;
