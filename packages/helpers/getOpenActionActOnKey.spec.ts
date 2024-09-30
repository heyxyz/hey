import { OpenActionModuleType } from "@hey/lens";
import { describe, expect, test } from "vitest";
import getOpenActionActOnKey from "./getOpenActionActOnKey";

describe("getOpenActionActOnKey", () => {
  test('should return "simpleCollectOpenAction" for SimpleCollectOpenActionModule', () => {
    expect(
      getOpenActionActOnKey(OpenActionModuleType.SimpleCollectOpenActionModule)
    ).toBe("simpleCollectOpenAction");
  });

  test('should return "multirecipientCollectOpenAction" for MultirecipientFeeCollectOpenActionModule', () => {
    expect(
      getOpenActionActOnKey(
        OpenActionModuleType.MultirecipientFeeCollectOpenActionModule
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
