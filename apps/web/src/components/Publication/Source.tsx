import { Tooltip } from '@components/UI/Tooltip';
import type { LensterPublication } from '@generated/types';
import { apps } from 'data/apps';
import { STATIC_IMAGES_URL } from 'data/constants';
import type { FC } from 'react';

interface Props {
  publication: LensterPublication;
}

const Source: FC<Props> = ({ publication }) => {
  const { appId } = publication;
  const show = apps.includes(appId);

  if (!show) {
    return null;
  }

  return (
    <Tooltip content={appId} placement="top">
      <img className="h-4 w-4 rounded-full" src={`${STATIC_IMAGES_URL}/source/${appId}.jpeg`} alt={appId} />
    </Tooltip>
  );
};

export default Source;
