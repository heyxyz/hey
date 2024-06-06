import type { FC } from 'react';

import { APP_NAME } from '@good/data/constants';
import { Card } from '@good/ui';
import { EyeSlashIcon } from '@heroicons/react/24/outline';

interface NotSupportedPublicationProps {
  type?: string;
}

const NotSupportedPublication: FC<NotSupportedPublicationProps> = ({
  type = 'Publication'
}) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="flex items-center space-x-1 px-4 py-3 text-sm">
        <EyeSlashIcon className="size-4 text-gray-500" />
        <span>
          {type.replace('MetadataV3', '')} type not supported on {APP_NAME}
        </span>
      </div>
    </Card>
  );
};

export default NotSupportedPublication;
