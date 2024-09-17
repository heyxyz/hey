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
});
