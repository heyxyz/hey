import type { MetadataLicenseType } from '@lens-protocol/metadata';
import type { FC } from 'react';

import { FeatureFlag } from '@hey/data/feature-flags';
import { PublicationMetadataLicenseType } from '@hey/lens';
import { Select } from '@hey/ui';
import getAssetLicense from '@lib/getAssetLicense';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';

const LicensePicker: FC = () => {
  const setLicense = usePublicationStore((state) => state.setLicense);

  if (!isFeatureEnabled(FeatureFlag.LensMember)) {
    return null;
  }

  return (
    <div className="mt-3">
      <Select
        label="Choose a license"
        onChange={(e) => setLicense(e.target.value as MetadataLicenseType)}
        options={
          Object.values(PublicationMetadataLicenseType)
            .filter((license) => getAssetLicense(license))
            .map((license) => ({
              label: getAssetLicense(license) as string,
              selected: true,
              value: license
            })) as any
        }
      />
    </div>
  );
};

export default LicensePicker;
