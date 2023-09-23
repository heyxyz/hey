import { apps } from '@lenster/data/apps';
import { STATIC_IMAGES_URL } from '@lenster/data/constants';
import type { AnyPublication } from '@lenster/lens';
import getAppName from '@lenster/lib/getAppName';
import { isMirrorPublication } from '@lenster/lib/publicationHelpers';
import { Tooltip } from '@lenster/ui';
import type { FC } from 'react';

interface SourceProps {
  publication: AnyPublication;
}

const Source: FC<SourceProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { appId } = targetPublication.metadata;
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
