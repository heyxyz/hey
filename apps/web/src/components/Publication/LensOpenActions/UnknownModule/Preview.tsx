import type { FC } from 'react';

import GetOpenActionModuleIcon from '@components/Shared/GetOpenActionModuleIcon';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { type OpenActionModule, useModuleMetadataQuery } from '@hey/lens';
import { Card, Tooltip } from '@hey/ui';

interface UnknownModulePreviewProps {
  module: OpenActionModule;
}

const UnknownModulePreview: FC<UnknownModulePreviewProps> = ({ module }) => {
  const { data, loading } = useModuleMetadataQuery({
    skip: !module?.contract.address,
    variables: { request: { implementation: module?.contract.address } }
  });

  if (module.__typename === 'UnknownOpenActionModuleSettings') {
    const contract = module?.contract.address;

    return (
      <Card className="flex bg-gray-50 p-5" forceRounded>
        <div className="w-full space-y-1.5 text-left">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2 w-full">
              <GetOpenActionModuleIcon
                className="text-brand-500"
                module={module}
              />
              {loading ? (
                <div className="shimmer h-4 my-1.5 w-4/12 rounded-full" />
              ) : (
                <b className="text-lg font-bold">
                  {data?.moduleMetadata?.metadata.title || 'Unknown Module'}
                </b>
              )}
              {data?.moduleMetadata?.verified ? (
                <Tooltip content="Verified Module">
                  <CheckBadgeIcon className="text-brand-500 size-5" />
                </Tooltip>
              ) : null}
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
