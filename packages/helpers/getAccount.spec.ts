import { describe, expect, test } from "vitest";
import getAccount from "./getAccount";

describe("getAccount", () => {
  test("should return the correct data when account is null", () => {
    const account = null;
    const result = getAccount(account);
    expect(result).toEqual({
      displayName: "...",
      link: "",
      slug: "...",
      slugWithPrefix: "...",
      sourceLink: "",
      staffLink: ""
    });
  });

  test("should return the correct data when account has handle", () => {
    const account: any = {
      handle: { localName: "john" },
      id: "123",
      metadata: { displayName: "John Doe" }
    };
    const result = getAccount(account);
    expect(result).toEqual({
      displayName: "John Doe",
      link: "/u/john",
      slug: "john",
      slugWithPrefix: "@john",
      sourceLink: "/u/john",
      staffLink: "/staff/users/123"
    });
  });

  test("should return the correct data when account has handle with source", () => {
    const account: any = {
      handle: { localName: "john" },
      id: "123",
      metadata: { displayName: "John Doe" }
    };
    const result = getAccount(account, "staff-picks");
    expect(result).toEqual({
      displayName: "John Doe",
      link: "/u/john",
      slug: "john",
      slugWithPrefix: "@john",
      sourceLink: "/u/john?source=staff-picks",
      staffLink: "/staff/users/123"
    });
  });

  test("should return slug as displayName if account metadata displayName is empty", () => {
    const account: any = {
      handle: { localName: "john" },
      id: "123",
      metadata: { displayName: "" }
    };
    const result = getAccount(account);
    expect(result).toEqual({
      displayName: "john",
      link: "/u/john",
      slug: "john",
      slugWithPrefix: "@john",
      sourceLink: "/u/john",
      staffLink: "/staff/users/123"
    });
  });

  test("should return slug as displayName if account metadata displayName is null", () => {
    const account: any = {
      handle: { localName: "john" },
      id: "123",
      metadata: { displayName: null }
    };
    const result = getAccount(account);
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
    const account: any = {
      handle: null,
      id: "789",
      metadata: { displayName: "User without handle" }
    };
    const result = getAccount(account);
    expect(result).toEqual({
      displayName: "User without handle",
      link: "/profile/789",
      slug: "789",
      slugWithPrefix: "#789",
      sourceLink: "/profile/789",
      staffLink: "/staff/users/789"
    });
  });

  test("should return correct sourceLink when source is provided but account has no handle", () => {
    const account: any = {
      handle: null,
      id: "456",
      metadata: { displayName: "Jane Smith" }
    };
    const result = getAccount(account, "featured");
    expect(result).toEqual({
      displayName: "Jane Smith",
      link: "/profile/456",
      slug: "456",
      slugWithPrefix: "#456",
      sourceLink: "/profile/456?source=featured",
      staffLink: "/staff/users/456"
    });
  });

  test("should handle account without metadata field", () => {
    const account: any = {
      handle: { localName: "john" },
      id: "123"
    };
    const result = getAccount(account);
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
