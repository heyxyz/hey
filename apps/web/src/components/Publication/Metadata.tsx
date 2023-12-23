import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { ScaleIcon } from '@heroicons/react/24/outline';
import { FeatureFlag } from '@hey/data/feature-flags';
import getPublicationData from '@hey/lib/getPublicationData';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Card } from '@hey/ui';
import getAssetLicense from '@lib/getAssetLicense';
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
  const license = getAssetLicense(filteredAsset?.license);

  if (!isFeatureEnabled(FeatureFlag.LensMember)) {
    return null;
  }

  if (!license) {
    return null;
  }

  return (
    <Card
      className="ld-text-gray-500 mt-3 space-y-2 px-3 py-2 text-sm"
      forceRounded
    >
      <div className="flex items-center space-x-2">
        <ScaleIcon className="text-brand-500 size-4 min-w-max" />
        <div>
          Licence: <b>{license}</b>
        </div>
      </div>
    </Card>
  );
};

export default memo(Metadata);
