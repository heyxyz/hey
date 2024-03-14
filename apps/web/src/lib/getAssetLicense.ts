import type { Maybe } from '@hey/lens';

import { PublicationMetadataLicenseType } from '@hey/lens';

const getAssetLicense = (
  licenseId: Maybe<PublicationMetadataLicenseType> | undefined
): {
  helper: string;
  label: string;
  link: string;
} | null => {
  if (!licenseId) {
    return null;
  }

  switch (licenseId) {
    case PublicationMetadataLicenseType.Cco:
      return {
        helper:
          'Anyone can use, modify and distribute the work without any restrictions or need for attribution. CC0',
        label: 'CC0 - no restrictions',
        link: 'https://creativecommons.org/public-domain/cc0'
      };
    case PublicationMetadataLicenseType.TbnlCDNplLegal:
      return {
        helper:
          'You allow the collector to use the content for any purpose, except creating or sharing any derivative works, such as remixes.',
        label: 'Commercial rights for collector',
        link: 'https://eips.ethereum.org/assets/eip-5218/ic3license/ic3license.pdf'
      };
    case PublicationMetadataLicenseType.TbnlNcDNplLegal:
      return {
        helper:
          'You allow the collector to use the content for any personal, non-commercial purpose, except creating or sharing any derivative works, such as remixes.',
        label: 'Personal rights for collector',
        link: 'https://eips.ethereum.org/assets/eip-5218/ic3license/ic3license.pdf'
      };
    default:
      return null;
  }
};

export default getAssetLicense;
