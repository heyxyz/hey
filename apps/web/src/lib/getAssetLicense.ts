import type { Maybe } from '@hey/lens';

import { PublicationMetadataLicenseType } from '@hey/lens';

const getAssetLicense = (
  licenseId: Maybe<PublicationMetadataLicenseType> | undefined
): {
  helper: string;
  label: string;
} | null => {
  if (!licenseId) {
    return null;
  }

  switch (licenseId) {
    case PublicationMetadataLicenseType.Cco:
      return {
        helper:
          'Anyone can use, modify and distribute the work without any restrictions or need for attribution. CC0',
        label: 'CC0 - no restrictions'
      };
    case PublicationMetadataLicenseType.TbnlCDNplLegal:
      return {
        helper:
          'The owner of the NFT can use, modify and distribute the work commercially and profit from it. TBNL-C-D-NPL-Legal',
        label: 'Commercial rights for (NFT owner)'
      };
    case PublicationMetadataLicenseType.TbnlNcDNplLegal:
      return {
        helper:
          'Personal use of the work is allowed, but not profiting or commercial use. TBNL-NC-D-NPL-Legal',
        label: 'Personal rights (NFT owner)'
      };
    default:
      return null;
  }
};

export default getAssetLicense;
