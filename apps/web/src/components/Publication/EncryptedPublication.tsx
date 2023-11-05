import { LockClosedIcon } from '@heroicons/react/24/outline';
import { Card } from '@hey/ui';
import { type FC, memo } from 'react';

interface EncryptedPublicationProps {
  type?: string;
}

const EncryptedPublication: FC<EncryptedPublicationProps> = ({
  type = 'Publication'
}) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="flex items-center space-x-1 px-4 py-3 text-sm">
        <LockClosedIcon className="h-4 w-4 text-gray-500" />
        <span>{type} has been encrypted</span>
      </div>
    </Card>
  );
};

export default memo(EncryptedPublication);
