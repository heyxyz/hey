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
        helper: 'CC0',
        label: 'Public domain - zero restrictions'
      };
    case PublicationMetadataLicenseType.TbnlCDNplLegal:
      return {
        helper: 'TBNL-C-D-NPL-Legal',
        label: 'NFT owner has full commercial rights'
      };
    case PublicationMetadataLicenseType.TbnlNcDNplLegal:
      return {
        helper: 'TBNL-NC-D-NPL-Legal',
        label: 'NFT owner has personal use rights'
      };
    default:
      return null;
  }
};

export default getAssetLicense;
