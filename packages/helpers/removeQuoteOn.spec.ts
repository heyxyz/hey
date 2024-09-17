import { describe, expect, test } from "vitest";

import removeQuoteOn from "./removeQuoteOn";

describe("removeQuoteOn", () => {
  test('should remove "quoteOn" property from a Quote object', () => {
    const publication: any = {
      author: "John Doe",
      content: "Lorem ipsum dolor sit amet",
      quoteOn: "Some quote"
    };

    const expectedPublication = {
      author: "John Doe",
      content: "Lorem ipsum dolor sit amet"
    };

    expect(removeQuoteOn(publication)).toEqual(expectedPublication);
  });

  test('should return the same object if "quoteOn" property is not present', () => {
    const publication: any = {
      author: "John Doe",
      content: "Lorem ipsum dolor sit amet"
    };

    expect(removeQuoteOn(publication)).toStrictEqual(publication);
  });
});
