import { hydrateAuthTokens } from "src/store/persisted/useAuthStore";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getAuthApiHeaders,
  getAuthApiHeadersWithAccessToken
} from "./getAuthApiHeaders";

// Mock the hydrateAuthTokens function
vi.mock("src/store/persisted/useAuthStore", () => ({
  hydrateAuthTokens: vi.fn()
}));

describe("getAuthApiHeaders", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  test("should return correct headers with access token", () => {
    const mockTokens = {
      accessToken: "mock-access-token",
      identityToken: "mock-identity-token"
    };
    (hydrateAuthTokens as any).mockReturnValue(mockTokens);

    const result = getAuthApiHeadersWithAccessToken();
    expect(result).toEqual({
      "X-Access-Token": "mock-access-token",
      "X-Identity-Token": "mock-identity-token"
    });
  });

  test("should return correct common headers without access token", () => {
    const mockTokens = { identityToken: "mock-identity-token" };
    (hydrateAuthTokens as any).mockReturnValue(mockTokens);

    const result = getAuthApiHeaders();
    expect(result).toEqual({ "X-Identity-Token": "mock-identity-token" });
  });
});
