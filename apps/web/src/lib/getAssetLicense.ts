import type { Maybe } from '@hey/lens';

import { MetadataLicenseType } from '@lens-protocol/metadata';

const getAssetLicense = (
  licenseId: Maybe<MetadataLicenseType> | undefined
): {
  helper: string;
  label: string;
  link: string;
} | null => {
  if (!licenseId) {
    return null;
  }

  switch (licenseId) {
    case MetadataLicenseType.CCO:
      return {
        helper:
          'Anyone can use, modify and distribute the work without any restrictions or need for attribution. CC0',
        label: 'CC0 - no restrictions',
        link: 'https://creativecommons.org/public-domain/cc0'
      };
    case MetadataLicenseType.TBNL_C_D_NPL_Legal:
      return {
        helper:
          'You allow the collector to use the content for any purpose, except creating or sharing any derivative works, such as remixes.',
        label: 'Commercial rights for the collector',
        link: 'https://eips.ethereum.org/assets/eip-5218/ic3license/ic3license.pdf'
      };
    case MetadataLicenseType.TBNL_NC_D_NPL_Legal:
      return {
        helper:
          'You allow the collector to use the content for any personal, non-commercial purpose, except creating or sharing any derivative works, such as remixes.',
        label: 'Personal rights for the collector',
        link: 'https://eips.ethereum.org/assets/eip-5218/ic3license/ic3license.pdf'
      };
    default:
      return null;
  }
};

export default getAssetLicense;
