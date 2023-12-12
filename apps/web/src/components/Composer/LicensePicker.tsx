import type { FC } from 'react';

import { Select } from '@hey/ui';
import { MetadataLicenseType } from '@lens-protocol/metadata';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';

const LicensePicker: FC = () => {
  const setLicense = usePublicationStore((state) => state.setLicense);

  if (!isFeatureEnabled('av-license')) {
    return null;
  }

  return (
    <div className="mt-3">
      <Select
        label="Choose a license"
        onChange={(e) => setLicense(e.target.value as MetadataLicenseType)}
        options={[
          {
            label: 'Creative Commons With Attribution',
            selected: true,
            value: MetadataLicenseType.CC_BY
          },
          {
            label: 'Creative Commons With Attribution - No Derivatives',
            value: MetadataLicenseType.CC_BY_ND
          },
          {
            label: 'Creative Commons With Attribution - Not for Commercial use',
            value: MetadataLicenseType.CC_BY_NC
          },
          {
            label: 'No Rights Reserved',
            value: MetadataLicenseType.CCO
          }
        ]}
      />
    </div>
  );
};

export default LicensePicker;
