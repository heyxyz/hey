import { type Maybe, MetadataLicenseType } from "@hey/indexer";

const getAssetLicense = (
  licenseId: Maybe<MetadataLicenseType> | undefined
): {
  helper: string;
  label: string;
} | null => {
  if (!licenseId) {
    return null;
  }

  switch (licenseId) {
    case MetadataLicenseType.Cco:
      return {
        helper:
          "Anyone can use, modify and distribute the work without any restrictions or need for attribution. CC0",
        label: "CC0 - no restrictions"
      };
    case MetadataLicenseType.TbnlCdNplLegal:
      return {
        helper:
          "You allow the collector to use the content for any purpose, except creating or sharing any derivative works, such as remixes.",
        label: "Commercial rights for the collector"
      };
    case MetadataLicenseType.TbnlNcDNplLegal:
      return {
        helper:
          "You allow the collector to use the content for any personal, non-commercial purpose, except creating or sharing any derivative works, such as remixes.",
        label: "Personal rights for the collector"
      };
    default:
      return null;
  }
};

export default getAssetLicense;
