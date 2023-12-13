import type { MetadataLicenseType } from '@lens-protocol/metadata';
import type { FC } from 'react';

import { PublicationMetadataLicenseType } from '@hey/lens';
import { Select } from '@hey/ui';
import getLicense from '@lib/getLicence';
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
            label: getLicense(PublicationMetadataLicenseType.CcBy),
            selected: true,
            value: PublicationMetadataLicenseType.CcBy
          },
          {
            label: getLicense(PublicationMetadataLicenseType.CcByNd),
            value: PublicationMetadataLicenseType.CcByNd
          },
          {
            label: getLicense(PublicationMetadataLicenseType.CcByNc),
            value: PublicationMetadataLicenseType.CcByNc
          },
          {
            label: getLicense(PublicationMetadataLicenseType.Cco),
            value: PublicationMetadataLicenseType.Cco
          }
        ]}
      />
    </div>
  );
};

export default LicensePicker;
