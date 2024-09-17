import { describe, expect, test } from "vitest";

import {
  isCommentPublication,
  isMirrorPublication
} from "./publicationHelpers";

describe("publicationHelpers", () => {
  describe("isMirrorPublication", () => {
    test("should return true for Mirror publication", () => {
      const publication: any = { __typename: "Mirror" };
      expect(isMirrorPublication(publication)).toBe(true);
    });

    test("should return false for non-Mirror publication", () => {
      const publication: any = { __typename: "Article" };
      expect(isMirrorPublication(publication)).toBe(false);
    });

    test("should return false for null", () => {
      const publication = null;
      expect(isMirrorPublication(publication)).toBe(false);
    });
  });

  describe("isCommentPublication", () => {
    test("should return true for Comment publication", () => {
      const publication: any = { __typename: "Comment" };
      expect(isCommentPublication(publication)).toBe(true);
    });

    test("should return false for non-Comment publication", () => {
      const publication: any = { __typename: "Article" };
      expect(isCommentPublication(publication)).toBe(false);
    });
  });
});
