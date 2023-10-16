import { APP_NAME } from '@hey/data/constants';
import { Card } from '@hey/ui';
import type { FC } from 'react';

interface NotSupportedPublicationProps {
  type?: string;
}

const NotSupportedPublication: FC<NotSupportedPublicationProps> = ({
  type = 'Publication'
}) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="px-4 py-3 text-sm">
        {type.replace('MetadataV3', '')} type not supported on {APP_NAME}
      </div>
    </Card>
  );
};

export default NotSupportedPublication;
