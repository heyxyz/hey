import { apps } from '@hey/data/apps';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import type { Publication } from '@hey/lens';
import getAppName from '@hey/lib/getAppName';
import { Tooltip } from '@hey/ui';
import type { FC } from 'react';

interface SourceProps {
  publication: Publication;
}

const Source: FC<SourceProps> = ({ publication }) => {
  const { appId } = publication;
  const show = apps.includes(appId);

  if (!show) {
    return null;
  }

  const appName = getAppName(appId);

  return (
    <Tooltip content={appName} placement="top">
      <img
        className="h-4 w-4 rounded-full"
        src={`${STATIC_IMAGES_URL}/source/${appId}.jpeg`}
        alt={appName}
      />
    </Tooltip>
  );
};

export default Source;
