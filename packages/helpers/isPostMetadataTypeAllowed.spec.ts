import { describe, expect, test } from "vitest";
import isPostMetadataTypeAllowed from "./isPostMetadataTypeAllowed";

describe("isPostMetadataTypeAllowed", () => {
  test("should return true for allowed type 'ArticleMetadataV3'", () => {
    const result = isPostMetadataTypeAllowed("ArticleMetadataV3");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'AudioMetadataV3'", () => {
    const result = isPostMetadataTypeAllowed("AudioMetadataV3");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'LinkMetadataV3'", () => {
    const result = isPostMetadataTypeAllowed("LinkMetadataV3");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'LiveStreamMetadataV3'", () => {
    const result = isPostMetadataTypeAllowed("LiveStreamMetadataV3");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'CheckingInMetadataV3'", () => {
    const result = isPostMetadataTypeAllowed("CheckingInMetadataV3");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'MintMetadataV3'", () => {
    const result = isPostMetadataTypeAllowed("MintMetadataV3");
    expect(result).toBe(true);
  });

  test("should return false if type is undefined", () => {
    const result = isPostMetadataTypeAllowed(undefined);
    expect(result).toBe(false);
  });

  test("should return false if type is an empty string", () => {
    const result = isPostMetadataTypeAllowed("");
    expect(result).toBe(false);
  });

  test("should return false for an unknown type", () => {
    const result = isPostMetadataTypeAllowed("UnknownMetadataV3");
    expect(result).toBe(false);
  });
});
