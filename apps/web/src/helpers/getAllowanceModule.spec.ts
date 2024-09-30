import { FollowModuleType, OpenActionModuleType } from "@hey/lens";
import { describe, expect, test } from "vitest";
import getAllowanceModule from "./getAllowanceModule";

describe("getAllowanceModule", () => {
  test("should return Simple collect module info for SimpleCollectOpenActionModule", () => {
    const result = getAllowanceModule(
      OpenActionModuleType.SimpleCollectOpenActionModule
    );
    expect(result).toEqual({
      field: "openActionModule",
      name: "Simple collect"
    });
  });

  test("should return Multirecipient collect module info for MultirecipientFeeCollectOpenActionModule", () => {
    const result = getAllowanceModule(
      OpenActionModuleType.MultirecipientFeeCollectOpenActionModule
    );
    expect(result).toEqual({
      field: "openActionModule",
      name: "Multirecipient paid collect"
    });
  });

  test("should return Fee follow module info for FeeFollowModule", () => {
    const result = getAllowanceModule(FollowModuleType.FeeFollowModule);
    expect(result).toEqual({ field: "followModule", name: "Fee follow" });
  });

  test("should return default collect module info for unknown module name", () => {
    const result = getAllowanceModule("UnknownModule");
    expect(result).toEqual({ field: "collectModule", name: "UnknownModule" });
  });
});
