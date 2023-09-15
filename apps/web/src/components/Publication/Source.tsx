import { apps } from '@lenster/data/apps';
import { STATIC_IMAGES_URL } from '@lenster/data/constants';
import type { Publication } from '@lenster/lens';
import getAppName from '@lenster/lib/getAppName';
import { Tooltip } from '@lenster/ui';
import type { FC } from 'react';

interface SourceProps {
  publication: Publication;
}

const Source: FC<SourceProps> = ({ publication }) => {
  const { appId } = publication;
  const show = apps.includes(appId);
  const appName = getAppName(appId);

  if (!show) {
    return null;
  }

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
