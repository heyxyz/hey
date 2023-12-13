import { PublicationMetadataLicenseType } from '@hey/lens';

const getLicense = (licenseId: string): string => {
  switch (licenseId) {
    case PublicationMetadataLicenseType.CcBy:
      return 'Creative Commons With Attribution';
    case PublicationMetadataLicenseType.CcByNd:
      return 'Creative Commons With Attribution - No Derivatives';
    case PublicationMetadataLicenseType.CcByNc:
      return 'Creative Commons With Attribution - Not for Commercial use';
    case PublicationMetadataLicenseType.Cco:
      return 'No Rights Reserved';
    default:
      return 'Unlicensed';
  }
};

export default getLicense;
