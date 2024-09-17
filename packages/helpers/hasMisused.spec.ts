import { describe, expect, test } from "vitest";

import hasMisused from "./hasMisused";

describe("hasMisused", () => {
  test("should return true if the ID is included in the scam list", () => {
    expect(hasMisused("0x011c4c")).toBeTruthy();
  });

  test("should return false if the ID is not included in the scam list", () => {
    expect(hasMisused("unknownID")).toBeFalsy();
  });
});
