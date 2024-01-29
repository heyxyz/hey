import type { FC } from 'react';

import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Portal } from '@hey/types/misc';
import { Card } from '@hey/ui';

interface PortalProps {
  portal: Portal;
  publicationId?: string;
}

const Portal: FC<PortalProps> = ({ portal, publicationId }) => {
  return (
    <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
      <img
        alt={portal.image}
        className="h-[400px] max-h-[400px] w-full rounded-t-xl object-cover"
        src={portal.image}
      />
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        gm
      </div>
    </Card>
  );
};

export default Portal;
