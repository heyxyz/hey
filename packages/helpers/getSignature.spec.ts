import { describe, expect, test } from "vitest";
import getSignature from "./getSignature";

describe("getSignature", () => {
  test("should return an object with domain, types, and value keys", () => {
    const result = getSignature({
      domain: {},
      types: {
        Post: []
      },
      value: {}
    });

    expect(result).toHaveProperty("domain");
    expect(result).toHaveProperty("types");
    expect(result).toHaveProperty("message");
    expect(result.primaryType).toEqual("Post");
  });

  test("should remove __typename property from domain, types, and value properties", () => {
    const input = {
      domain: { __typename: "Domain", key: "value" },
      types: { __typename: "Types", key: "value" },
      value: { __typename: "Value", key: "value" }
    };
    const result = getSignature(input);

    expect(result).toEqual({
      domain: { key: "value" },
      message: { key: "value" },
      primaryType: "key",
      types: { key: "value" }
    });
  });

  test("should handle nested __typename properties correctly", () => {
    const input = {
      domain: {
        __typename: "Domain",
        key: "value",
        nested: { __typename: "Nested", innerKey: "innerValue" }
      },
      types: {
        __typename: "Types",
        key: "value",
        nested: { __typename: "Nested", innerKey: "innerValue" }
      },
      value: {
        __typename: "Value",
        key: "value",
        nested: { __typename: "Nested", innerKey: "innerValue" }
      }
    };
    const result = getSignature(input);

    expect(result).toEqual({
      domain: { key: "value", nested: { innerKey: "innerValue" } },
      message: { key: "value", nested: { innerKey: "innerValue" } },
      primaryType: "key",
      types: { key: "value", nested: { innerKey: "innerValue" } }
    });
  });

  test("should return an empty object for domain, message, and types if input is empty", () => {
    const result = getSignature({
      domain: {},
      types: {},
      value: {}
    });

    expect(result).toEqual({
      domain: {},
      message: {},
      primaryType: undefined,
      types: {}
    });
  });

  test("should correctly return primaryType when types have multiple keys", () => {
    const input = {
      domain: {},
      types: { Post: [], Comment: [] },
      value: {}
    };
    const result = getSignature(input);

    expect(result.primaryType).toEqual("Post");
  });

  test("should not break if __typename is not present in any of the inputs", () => {
    const input = {
      domain: { key: "value" },
      types: { key: "value" },
      value: { key: "value" }
    };
    const result = getSignature(input);

    expect(result).toEqual({
      domain: { key: "value" },
      message: { key: "value" },
      primaryType: "key",
      types: { key: "value" }
    });
  });
});
