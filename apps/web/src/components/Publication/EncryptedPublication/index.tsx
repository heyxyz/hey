import type { MirrorablePublication } from '@hey/lens';
import type { FC } from 'react';

import { LockClosedIcon } from '@heroicons/react/24/solid';
import { Card } from '@hey/ui';

import Criteria from './Criteria';

interface EncryptedPublicationProps {
  publication: MirrorablePublication;
}

const EncryptedPublication: FC<EncryptedPublicationProps> = ({
  publication
}) => {
  const type = publication.__typename;
  const { encryptedWith } = publication.metadata;
  const accessCondition = encryptedWith?.accessCondition;

  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="space-y-4 px-4 py-3 text-sm">
        <div className="flex items-center space-x-1">
          <LockClosedIcon className="size-4 text-green-500" />
          <span>{type} has been encrypted</span>
        </div>
        {accessCondition ? (
          <Criteria accessCondition={accessCondition} />
        ) : null}
      </div>
    </Card>
  );
};

export default EncryptedPublication;
