import { describe, expect, test } from "vitest";

import parseJwt from "./parseJwt";

describe("parseJwt", () => {
  test("should parse and return token expiration time", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4ZDhkQTZCRjI2OTY0YUY5RDdlRWQ5ZTAzRTUzNDE1RDM3YUE5NjA0NSIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyMn0.FEM9X7UJMvEHAJZN4flpqOeTm-K-p8QHjaEoYsN2Z-8";
    const result = parseJwt(token);
    expect(result).toMatchObject({ exp: 1516239022 });
  });

  test("should return default expiration time on a non-parsable token", () => {
    const token = "invalid_token";
    const result = parseJwt(token);
    expect(result).toMatchObject({ exp: 0 });
  });
});
