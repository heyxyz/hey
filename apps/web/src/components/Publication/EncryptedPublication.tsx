import type { FC } from 'react';

import { LockClosedIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@hey/data/constants';
import { Card } from '@hey/ui';

const EncryptedPublication: FC = () => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="flex items-center space-x-1 px-4 py-3 text-sm">
        <LockClosedIcon className="size-4 text-gray-500" />
        <span>Encrypted publication not supported on {APP_NAME}</span>
      </div>
    </Card>
  );
};

export default EncryptedPublication;
