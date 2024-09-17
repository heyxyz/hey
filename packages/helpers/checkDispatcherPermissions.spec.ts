import { describe, expect, test } from "vitest";

import checkDispatcherPermissions from "./checkDispatcherPermissions";

describe("checkDispatcherPermissions", () => {
  test("should return false for all permissions when profile is null", () => {
    const result = checkDispatcherPermissions(null);

    expect(result.canUseSignless).toBe(false);
    expect(result.canUseLensManager).toBe(false);
    expect(result.canBroadcast).toBe(false);
  });

  // TODO: don't skip this test
  test.skip("should return correct permissions when profile has signless and is sponsored", () => {
    const profile: any = { signless: true, sponsor: true };
    const result = checkDispatcherPermissions(profile);

    expect(result.canUseSignless).toBe(true);
    expect(result.canUseLensManager).toBe(true);
    expect(result.canBroadcast).toBe(false);
  });

  test("should return correct permissions when profile has no signless but is sponsored", () => {
    const profile: any = { signless: false, sponsor: true };
    const result = checkDispatcherPermissions(profile);

    expect(result.canUseSignless).toBe(false);
    expect(result.canUseLensManager).toBe(false);
    expect(result.canBroadcast).toBe(true);
  });

  test("should return correct permissions when profile has signless but is not sponsored", () => {
    const profile: any = { signless: true, sponsor: false };
    const result = checkDispatcherPermissions(profile);

    expect(result.canUseSignless).toBe(true);
    expect(result.canUseLensManager).toBe(false);
    expect(result.canBroadcast).toBe(false);
  });

  test("should return correct permissions when profile has no signless and is not sponsored", () => {
    const profile: any = { signless: false, sponsor: false };
    const result = checkDispatcherPermissions(profile);

    expect(result.canUseSignless).toBe(false);
    expect(result.canUseLensManager).toBe(false);
    expect(result.canBroadcast).toBe(false);
  });
});
