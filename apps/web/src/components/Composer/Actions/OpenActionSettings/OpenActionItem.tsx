import type { Dispatch, FC, ReactNode, SetStateAction } from 'react';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Card } from '@hey/ui';

interface OpenActionItemProps {
  description: string;
  icon: ReactNode;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  title: string;
}

const OpenActionItem: FC<OpenActionItemProps> = ({
  description,
  icon,
  setShowModal,
  title
}) => {
  return (
    <Card
      className="flex cursor-pointer items-center justify-between p-5"
      forceRounded
    >
      <div className="flex items-center space-x-3">
        <div className="text-brand-500">{icon}</div>
        <div className="space-y-1">
          <div className="font-bold">{title}</div>
          <div className="text-sm">{description}</div>
        </div>
      </div>
      <ArrowRightIcon className="size-5 text-gray-400" />
    </Card>
  );
};

export default OpenActionItem;
