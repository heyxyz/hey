import type {
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { FC } from 'react';

import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Card } from '@hey/ui';

interface RentableBillboardOpenActionProps {
  module: UnknownOpenActionModuleSettings;
  publication?: MirrorablePublication;
}

const RentableBillboardOpenAction: FC<RentableBillboardOpenActionProps> = ({
  module,
  publication
}) => {
  return (
    <div className="w-fit max-w-sm space-y-5" onClick={stopEventPropagation}>
      <Card className="p-5" forceRounded>
        gm
      </Card>
    </div>
  );
};

export default RentableBillboardOpenAction;
