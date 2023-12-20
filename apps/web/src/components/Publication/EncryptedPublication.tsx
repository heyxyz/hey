import type { MirrorablePublication } from '@hey/lens';
import type { FC } from 'react';

import { LockClosedIcon } from '@heroicons/react/24/solid';
import { Card } from '@hey/ui';

interface EncryptedPublicationProps {
  publication: MirrorablePublication;
}

const EncryptedPublication: FC<EncryptedPublicationProps> = ({
  publication
}) => {
  const type = publication.__typename;

  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="flex items-center space-x-1 px-4 py-3 text-sm">
        <LockClosedIcon className="h-4 w-4 text-green-500" />
        <span>{type} has been encrypted</span>
      </div>
    </Card>
  );
};

export default EncryptedPublication;
