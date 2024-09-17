import { describe, expect, test } from "vitest";

import getProfile from "./getProfile";

describe("getProfile", () => {
  test("should return the correct data when profile is null", () => {
    const profile = null;
    const result = getProfile(profile);
    expect(result).toEqual({
      displayName: "...",
      link: "",
      slug: "...",
      slugWithPrefix: "...",
      sourceLink: "",
      staffLink: ""
    });
  });

  test("should return the correct data when profile has handle", () => {
    const profile: any = {
      handle: { localName: "john" },
      id: "123",
      metadata: { displayName: "John Doe" }
    };
    const result = getProfile(profile);
    expect(result).toEqual({
      displayName: "John Doe",
      link: "/u/john",
      slug: "john",
      slugWithPrefix: "@john",
      sourceLink: "/u/john",
      staffLink: "/staff/users/123"
    });
  });

  test("should return the correct data when profile does not have handle", () => {
    const profile: any = {
      id: "456",
      metadata: { displayName: "Jane Smith" }
    };
    const result = getProfile(profile);
    expect(result).toEqual({
      displayName: "Jane Smith",
      link: "/profile/456",
      slug: "456",
      slugWithPrefix: "#456",
      sourceLink: "/profile/456",
      staffLink: "/staff/users/456"
    });
  });

  test("should return the correct data when profile has handle with source", () => {
    const profile: any = {
      handle: { localName: "john" },
      id: "123",
      metadata: { displayName: "John Doe" }
    };
    const result = getProfile(profile, "staff-picks");
    expect(result).toEqual({
      displayName: "John Doe",
      link: "/u/john",
      slug: "john",
      slugWithPrefix: "@john",
      sourceLink: "/u/john?source=staff-picks",
      staffLink: "/staff/users/123"
    });
  });
});
