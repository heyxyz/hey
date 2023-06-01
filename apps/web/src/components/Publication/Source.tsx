import { apps } from '@lenster/data/apps';
import { STATIC_IMAGES_URL } from '@lenster/data/constants';
import type { Publication } from '@lenster/lens';
import type { FC } from 'react';
import { Tooltip } from 'ui';

interface SourceProps {
  publication: Publication;
}

const Source: FC<SourceProps> = ({ publication }) => {
  const { appId } = publication;
  const show = apps.includes(appId);

  if (!show) {
    return null;
  }

  return (
    <Tooltip content={appId} placement="top">
      <img
        className="h-4 w-4 rounded-full"
        src={`${STATIC_IMAGES_URL}/source/${appId}.jpeg`}
        alt={appId}
      />
    </Tooltip>
  );
};

export default Source;
