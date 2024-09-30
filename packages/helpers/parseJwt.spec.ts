import { describe, expect, test } from "vitest";
import parseJwt from "./parseJwt";

describe("parseJwt", () => {
  test("should parse and return token fields correctly", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4ZDhkQTZCRjI2OTY0YUY5RDdlRWQ5ZTAzRTUzNDE1RDM3YUE5NjA0NSIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyMn0.FEM9X7UJMvEHAJZN4flpqOeTm-K-p8QHjaEoYsN2Z-8";
    const result = parseJwt(token);
    expect(result).toMatchObject({
      id: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      role: "normal",
      iat: 1516239022,
      exp: 1516239022
    });
  });

  test("should return default object with empty fields for an invalid token", () => {
    const token = "invalid_token";
    const result = parseJwt(token);
    expect(result).toEqual({
      authorizationId: "",
      evmAddress: "",
      exp: 0,
      iat: 0,
      id: "",
      role: ""
    });
  });

  test("should handle a token with missing fields and return defaults for missing fields", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4ZDhkQTZCRjI2OTY0YUY5RDdlRWQ5ZTAzRTUzNDE1RDM3YUE5NjA0NSIsImV4cCI6MTUxNjIzOTAyMn0.qQs72HtCnEY8LeKnRbl2Tg2T7wwvFYJzM8_vzTLobX0";
    const result = parseJwt(token);
    expect(result).toMatchObject({
      id: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      exp: 1516239022
    });
  });

  test("should handle valid token but invalid base64 encoded payload", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid_payload.FEM9X7UJMvEHAJZN4flpqOeTm-K-p8QHjaEoYsN2Z-8";
    const result = parseJwt(token);
    expect(result).toEqual({
      authorizationId: "",
      evmAddress: "",
      exp: 0,
      iat: 0,
      id: "",
      role: ""
    });
  });

  test("should handle a valid token with minimal fields", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTYyMzkwMjJ9.dQw4w9WgXcQ";
    const result = parseJwt(token);
    expect(result).toMatchObject({
      exp: 1516239022
    });
  });
});
