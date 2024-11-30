import { describe, expect, test } from "vitest";
import isPostMetadataTypeAllowed from "./isPostMetadataTypeAllowed";

describe("isPostMetadataTypeAllowed", () => {
  test("should return true for allowed type 'ArticleMetadata'", () => {
    const result = isPostMetadataTypeAllowed("ArticleMetadata");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'AudioMetadata'", () => {
    const result = isPostMetadataTypeAllowed("AudioMetadata");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'LinkMetadata'", () => {
    const result = isPostMetadataTypeAllowed("LinkMetadata");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'LivestreamMetadata'", () => {
    const result = isPostMetadataTypeAllowed("LivestreamMetadata");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'CheckingInMetadata'", () => {
    const result = isPostMetadataTypeAllowed("CheckingInMetadata");
    expect(result).toBe(true);
  });

  test("should return true for allowed type 'MintMetadata'", () => {
    const result = isPostMetadataTypeAllowed("MintMetadata");
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
    const result = isPostMetadataTypeAllowed("UnknownMetadata");
    expect(result).toBe(false);
  });
});
