import type { FC } from 'react';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { FeatureFlag } from '@hey/data/feature-flags';
import { PublicationMetadataLicenseType } from '@hey/lens';
import { Select } from '@hey/ui';
import getAssetLicense from '@lib/getAssetLicense';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import { usePublicationLicenseStore } from 'src/store/non-persisted/publication/usePublicationLicenseStore';

const LicensePicker: FC = () => {
  const { license, setLicense } = usePublicationLicenseStore();

  if (!isFeatureAvailable(FeatureFlag.Staff)) {
    return null;
  }

  const otherOptions = Object.values(PublicationMetadataLicenseType)
    .filter((type) => getAssetLicense(type))
    .map((type) => ({
      helper: getAssetLicense(type)?.helper as string,
      label: getAssetLicense(type)?.label as string,
      selected: license === type,
      value: type
    })) as any;

  const options = [
    {
      helper: 'Unlicensed',
      label: 'No license',
      selected: license === null,
      value: null
    },
    ...otherOptions
  ];

  return (
    <div className="my-5">
      <div className="divider mb-3" />
      <div className="mb-2 flex items-center justify-between">
        <b>License</b>
        <div className="ld-text-gray-500 text-sm">What's this?</div>
      </div>
      <Select
        onChange={(value) =>
          setLicense(value as PublicationMetadataLicenseType)
        }
        options={options}
      />
      <div className="mt-2 flex items-center space-x-1.5">
        <ExclamationCircleIcon className="size-4" />
        <div className="ld-text-gray-500 text-sm">
          All licenses are irrevocable, you can only license your original
          creations
        </div>
      </div>
    </div>
  );
};

export default LicensePicker;
