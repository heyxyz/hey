import type { MetadataAttribute } from "@hey/indexer";
import { MetadataAttributeType } from "@hey/indexer";
import { describe, expect, test } from "vitest";
import getPostAttribute from "./getPostAttribute";

describe("getPostAttribute", () => {
  const attributes: MetadataAttribute[] = [
    { key: "type", type: MetadataAttributeType.String, value: "book" },
    { key: "author", type: MetadataAttributeType.String, value: "John Doe" },
    { key: "year", type: MetadataAttributeType.String, value: "2021" }
  ];

  test("should return empty string if attributes is undefined", () => {
    expect(getPostAttribute(undefined, "type")).toBe("");
  });

  test("should return empty string if key is not found in attributes", () => {
    expect(getPostAttribute(attributes, "title")).toBe("");
  });

  test("should return the value of the matching key", () => {
    expect(getPostAttribute(attributes, "author")).toBe("John Doe");
    expect(getPostAttribute(attributes, "year")).toBe("2021");
  });

  test("should return the first matching key if there are multiple matches", () => {
    const updatedAttributes = [
      ...attributes,
      {
        key: "author",
        type: MetadataAttributeType.String,
        value: "Jane Smith"
      }
    ];
    expect(getPostAttribute(updatedAttributes, "author")).toBe("John Doe");
  });
});
