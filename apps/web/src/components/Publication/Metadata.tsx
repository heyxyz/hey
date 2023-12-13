import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { ScaleIcon } from '@heroicons/react/24/outline';
import getPublicationData from '@hey/lib/getPublicationData';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Card } from '@hey/ui';
import getLicense from '@lib/getLicence';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { memo } from 'react';

interface MetadataProps {
  publication: AnyPublication;
}

const Metadata: FC<MetadataProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;

  const filteredAsset = getPublicationData(targetPublication.metadata)?.asset;

  if (!isFeatureEnabled('av-license')) {
    return null;
  }

  if (!filteredAsset?.license) {
    return null;
  }

  return (
    <Card className="ld-text-gray-500 mt-2 px-3 py-2 text-sm" forceRounded>
      <div className="flex items-center space-x-2">
        <ScaleIcon className="text-brand-500 h-4 w-4 min-w-max" />
        <div>
          Licenced under <b>{getLicense(filteredAsset.license)}</b>
        </div>
      </div>
    </Card>
  );
};

export default memo(Metadata);
