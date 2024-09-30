import { describe, expect, test } from "vitest";
import isPublicationMetadataTypeAllowed from "./isPublicationMetadataTypeAllowed";

describe("isPublicationMetadataTypeAllowed", () => {
  test("should return true for allowed type 'ArticleMetadataV3'", () => {
    const result = isPublicationMetadataTypeAllowed("ArticleMetadataV3");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'AudioMetadataV3'", () => {
    const result = isPublicationMetadataTypeAllowed("AudioMetadataV3");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'LinkMetadataV3'", () => {
    const result = isPublicationMetadataTypeAllowed("LinkMetadataV3");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'LiveStreamMetadataV3'", () => {
    const result = isPublicationMetadataTypeAllowed("LiveStreamMetadataV3");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'CheckingInMetadataV3'", () => {
    const result = isPublicationMetadataTypeAllowed("CheckingInMetadataV3");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'MintMetadataV3'", () => {
    const result = isPublicationMetadataTypeAllowed("MintMetadataV3");
    expect(result).toBe(true);
  });

  test("should return false if type is undefined", () => {
    const result = isPublicationMetadataTypeAllowed(undefined);
    expect(result).toBe(false);
  });

  test("should return false if type is an empty string", () => {
    const result = isPublicationMetadataTypeAllowed("");
    expect(result).toBe(false);
  });

  test("should return false for an unknown type", () => {
    const result = isPublicationMetadataTypeAllowed("UnknownMetadataV3");
    expect(result).toBe(false);
  });
});
