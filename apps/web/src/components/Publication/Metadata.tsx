import type { PublicationMetadata } from "@hey/lens";
import type { FC } from "react";

import getAssetLicense from "@helpers/getAssetLicense";
import { ScaleIcon } from "@heroicons/react/24/outline";
import getPublicationData from "@hey/helpers/getPublicationData";
import { Card } from "@hey/ui";
import { memo } from "react";

interface MetadataProps {
  metadata: PublicationMetadata;
}

const Metadata: FC<MetadataProps> = ({ metadata }) => {
  const filteredAsset = getPublicationData(metadata)?.asset;
  const license = getAssetLicense(filteredAsset?.license);

  if (!license) {
    return null;
  }

  return (
    <Card
      className="ld-text-gray-500 mt-3 space-y-2 px-3 py-2 text-sm"
      forceRounded
    >
      <div className="flex items-center space-x-2">
        <ScaleIcon className="size-4 min-w-max" />
        <div>
          Licence: <b>{license.label}</b>
        </div>
      </div>
    </Card>
  );
};

export default memo(Metadata);
