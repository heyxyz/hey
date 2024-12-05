import { PostActionType } from "@hey/indexer";
import { describe, expect, test } from "vitest";
import getOpenActionActOnKey from "./getPostActionActOnKey";

describe("getOpenActionActOnKey", () => {
  test('should return "simpleCollectOpenAction" for SimpleCollectOpenActionModule', () => {
    expect(getOpenActionActOnKey(PostActionType.SimpleCollectAction)).toBe(
      "simpleCollectOpenAction"
    );
  });

  test('should return "multirecipientCollectOpenAction" for MultirecipientFeeCollectOpenActionModule', () => {
    expect(
      getOpenActionActOnKey(
        PostActionType.MultirecipientFeeCollectOpenActionModule
      )
    ).toBe("multirecipientCollectOpenAction");
  });

  test('should return "unknownOpenAction" for any other module name', () => {
    expect(getOpenActionActOnKey("someRandomModuleName")).toBe(
      "unknownOpenAction"
    );
  });

  test('should return "unknownOpenAction" for an empty string', () => {
    expect(getOpenActionActOnKey("")).toBe("unknownOpenAction");
  });

  test('should return "unknownOpenAction" for null input', () => {
    expect(getOpenActionActOnKey(null as any)).toBe("unknownOpenAction");
  });

  test('should return "unknownOpenAction" for undefined input', () => {
    expect(getOpenActionActOnKey(undefined as any)).toBe("unknownOpenAction");
  });

  test('should return "unknownOpenAction" for numeric input', () => {
    expect(getOpenActionActOnKey(123 as any)).toBe("unknownOpenAction");
  });
});
