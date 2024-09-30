import { MetadataLicenseType } from "@lens-protocol/metadata";
import { describe, expect, test } from "vitest";
import getAssetLicense from "./getAssetLicense";

describe("getAssetLicense", () => {
  test("should return correct info for CC0 license", () => {
    const result = getAssetLicense(MetadataLicenseType.CCO);
    expect(result).toEqual({
      helper:
        "Anyone can use, modify and distribute the work without any restrictions or need for attribution. CC0",
      label: "CC0 - no restrictions"
    });
  });

  test("should return correct info for TBNL_C_D_NPL_Legal license", () => {
    const result = getAssetLicense(MetadataLicenseType.TBNL_C_D_NPL_Legal);
    expect(result).toEqual({
      helper:
        "You allow the collector to use the content for any purpose, except creating or sharing any derivative works, such as remixes.",
      label: "Commercial rights for the collector"
    });
  });

  test("should return correct info for TBNL_NC_D_NPL_Legal license", () => {
    const result = getAssetLicense(MetadataLicenseType.TBNL_NC_D_NPL_Legal);
    expect(result).toEqual({
      helper:
        "You allow the collector to use the content for any personal, non-commercial purpose, except creating or sharing any derivative works, such as remixes.",
      label: "Personal rights for the collector"
    });
  });

  test("should return null for unknown license type", () => {
    const result = getAssetLicense("UnknownLicenseType" as any);
    expect(result).toBeNull();
  });

  test("should return null if licenseId is null", () => {
    const result = getAssetLicense(null);
    expect(result).toBeNull();
  });

  test("should return null if licenseId is undefined", () => {
    const result = getAssetLicense(undefined);
    expect(result).toBeNull();
  });
});
