import parseJwt from "@hey/helpers/parseJwt";
import { hydrateAuthTokens } from "src/store/persisted/useAuthStore";
import { beforeEach, describe, expect, test, vi } from "vitest";
import getCurrentSession from "./getCurrentSession";

// Mock the `hydrateAuthTokens` and `parseJwt` functions
vi.mock("src/store/persisted/useAuthStore", () => ({
  hydrateAuthTokens: vi.fn()
}));

vi.mock("@hey/helpers/parseJwt", () => ({
  default: vi.fn()
}));

describe("getCurrentSession", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  test("should return session details when accessToken is valid", () => {
    const mockTokens = { accessToken: "mock-access-token" };
    const mockParsedJwt = {
      authenticationId: "auth-123",
      owner: "0x1234567890abcdef",
      address: "0x1234567890abcdef"
    };

    (hydrateAuthTokens as any).mockReturnValue(mockTokens);
    (parseJwt as any).mockReturnValue(mockParsedJwt);

    const result = getCurrentSession();

    expect(result).toEqual({
      authenticationId: "auth-123",
      owner: "0x1234567890abcdef",
      address: "0x1234567890abcdef"
    });
  });

  test("should return empty strings if accessToken is invalid", () => {
    const mockTokens = { accessToken: "invalid-token" };
    const mockParsedJwt = {};

    (hydrateAuthTokens as any).mockReturnValue(mockTokens);
    (parseJwt as any).mockReturnValue(mockParsedJwt);

    const result = getCurrentSession();

    expect(result).toEqual({
      authenticationId: undefined,
      owner: undefined,
      address: undefined
    });
  });
});
