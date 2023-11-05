import GetOpenActionModuleIcon from '@components/Shared/GetOpenActionModuleIcon';
import type { OpenActionModule } from '@hey/lens';
import getOpenActionModuleData from '@hey/lib/getOpenActionModuleData';
import { Card } from '@hey/ui';
import { type FC } from 'react';

interface CollectModulePreviewProps {
  module: OpenActionModule;
}

const UnknownModulePreview: FC<CollectModulePreviewProps> = ({ module }) => {
  if (module.__typename === 'UnknownOpenActionModuleSettings') {
    const contract = module?.contract.address;

    return (
      <Card className="flex bg-gray-50 p-5" forceRounded>
        <div className="w-full space-y-1.5 text-left">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <GetOpenActionModuleIcon
                module={module}
                className="text-brand-500"
              />
              <b className="text-lg font-bold">
                {getOpenActionModuleData(module)?.name}
              </b>
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
