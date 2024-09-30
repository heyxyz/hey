import { hydrateVerifiedMembers } from "src/store/persisted/useVerifiedMembersStore";
import { beforeEach, describe, expect, test, vi } from "vitest";
import isVerified from "./isVerified";

// Mock the hydrateVerifiedMembers function
vi.mock("src/store/persisted/useVerifiedMembersStore", () => ({
  hydrateVerifiedMembers: vi.fn()
}));

describe("isVerified", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  test("should return true if the profile id is in the verifiedMembers list", () => {
    const mockVerifiedMembers = {
      verifiedMembers: ["profile123", "profile456"]
    };

    (hydrateVerifiedMembers as any).mockReturnValue(mockVerifiedMembers);
    const result = isVerified("profile123");
    expect(result).toBe(true);
  });

  test("should return false if the profile id is not in the verifiedMembers list", () => {
    const mockVerifiedMembers = {
      verifiedMembers: ["profile123", "profile456"]
    };

    (hydrateVerifiedMembers as any).mockReturnValue(mockVerifiedMembers);
    const result = isVerified("profile789");
    expect(result).toBe(false);
  });

  test("should return false if verifiedMembers is empty", () => {
    const mockVerifiedMembers = { verifiedMembers: [] };

    (hydrateVerifiedMembers as any).mockReturnValue(mockVerifiedMembers);
    const result = isVerified("profile123");
    expect(result).toBe(false);
  });
});
