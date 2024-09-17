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
});
