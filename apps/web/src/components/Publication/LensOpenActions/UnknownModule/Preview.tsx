import type { OpenActionModule } from '@hey/lens';
import type { FC } from 'react';

import GetOpenActionModuleIcon from '@components/Shared/GetOpenActionModuleIcon';
import { Card } from '@hey/ui';

interface UnknownModulePreviewProps {
  module: OpenActionModule;
}

const UnknownModulePreview: FC<UnknownModulePreviewProps> = ({ module }) => {
  if (module.__typename === 'UnknownOpenActionModuleSettings') {
    const contract = module?.contract.address;

    return (
      <Card className="flex bg-gray-50 p-5" forceRounded>
        <div className="w-full space-y-1.5 text-left">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <GetOpenActionModuleIcon
                className="text-brand-500"
                module={module}
              />
              <b className="text-lg font-bold">Unknown Module</b>
            </div>
          </div>
          <div className="ld-text-gray-500 text-sm">{contract}</div>
        </div>
      </Card>
    );
  }

  return null;
};

export default UnknownModulePreview;
