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

  test("should return slug as displayName if profile metadata displayName is empty", () => {
    const profile: any = {
      handle: { localName: "john" },
      id: "123",
      metadata: { displayName: "" }
    };
    const result = getProfile(profile);
    expect(result).toEqual({
      displayName: "john",
      link: "/u/john",
      slug: "john",
      slugWithPrefix: "@john",
      sourceLink: "/u/john",
      staffLink: "/staff/users/123"
    });
  });

  test("should return slug as displayName if profile metadata displayName is null", () => {
    const profile: any = {
      handle: { localName: "john" },
      id: "123",
      metadata: { displayName: null }
    };
    const result = getProfile(profile);
    expect(result).toEqual({
      displayName: "john",
      link: "/u/john",
      slug: "john",
      slugWithPrefix: "@john",
      sourceLink: "/u/john",
      staffLink: "/staff/users/123"
    });
  });

  test("should return id as slug if handle is null", () => {
    const profile: any = {
      handle: null,
      id: "789",
      metadata: { displayName: "User without handle" }
    };
    const result = getProfile(profile);
    expect(result).toEqual({
      displayName: "User without handle",
      link: "/profile/789",
      slug: "789",
      slugWithPrefix: "#789",
      sourceLink: "/profile/789",
      staffLink: "/staff/users/789"
    });
  });

  test("should return correct sourceLink when source is provided but profile has no handle", () => {
    const profile: any = {
      handle: null,
      id: "456",
      metadata: { displayName: "Jane Smith" }
    };
    const result = getProfile(profile, "featured");
    expect(result).toEqual({
      displayName: "Jane Smith",
      link: "/profile/456",
      slug: "456",
      slugWithPrefix: "#456",
      sourceLink: "/profile/456?source=featured",
      staffLink: "/staff/users/456"
    });
  });

  test("should handle profile without metadata field", () => {
    const profile: any = {
      handle: { localName: "john" },
      id: "123"
    };
    const result = getProfile(profile);
    expect(result).toEqual({
      displayName: "john",
      link: "/u/john",
      slug: "john",
      slugWithPrefix: "@john",
      sourceLink: "/u/john",
      staffLink: "/staff/users/123"
    });
  });
});
