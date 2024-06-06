import type { FC } from 'react';

import { apps } from '@good/data/apps';
import { STATIC_IMAGES_URL } from '@good/data/constants';
import getAppName from '@good/helpers/getAppName';
import { Tooltip } from '@good/ui';

interface SourceProps {
  publishedOn: string;
}

const Source: FC<SourceProps> = ({ publishedOn }) => {
  const show = apps.includes(publishedOn);

  if (!show) {
    return null;
  }

  const appName = getAppName(publishedOn);

  return (
    <Tooltip content={appName} placement="top">
      <img
        alt={appName}
        className="mt-0.5 h-3.5 rounded-sm"
        height={14}
        src={`${STATIC_IMAGES_URL}/source/${publishedOn}.png`}
      />
    </Tooltip>
  );
};

export default Source;
