import { describe, expect, test } from "vitest";
import removeQuoteOn from "./removeQuoteOn";

describe("removeQuoteOn", () => {
  test('should remove "quoteOn" property from a Quote object', () => {
    const post: any = {
      author: "John Doe",
      content: "Lorem ipsum dolor sit amet",
      quoteOn: "Some quote"
    };

    const expectedPost = {
      author: "John Doe",
      content: "Lorem ipsum dolor sit amet"
    };

    expect(removeQuoteOn(post)).toEqual(expectedPost);
  });

  test('should return the same object if "quoteOn" property is not present', () => {
    const post: any = {
      author: "John Doe",
      content: "Lorem ipsum dolor sit amet"
    };

    expect(removeQuoteOn(post)).toStrictEqual(post);
  });
});
