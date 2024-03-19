import type { FC } from 'react';

import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { Badge } from '@hey/ui';

interface OpenActionProps {
  name?: string;
}

const OpenAction: FC<OpenActionProps> = ({ name = 'Open Action' }) => {
  return (
    <Badge className="flex items-center space-x-1 border-green-700 bg-green-600">
      <Squares2X2Icon className="size-3" />
      <span>{name}</span>
    </Badge>
  );
};

export default OpenAction;
