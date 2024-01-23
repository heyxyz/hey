import type { FC } from 'react';

import { Card } from '@hey/ui';

interface HiddenPublicationProps {
  type?: string;
}

const HiddenPublication: FC<HiddenPublicationProps> = ({
  type = 'Publication'
}) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="px-4 py-3 text-sm">{type} was hidden by the author</div>
    </Card>
  );
};

export default HiddenPublication;
