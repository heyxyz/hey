import { describe, expect, test } from "vitest";
import { Regex } from "../regex";

describe("Regex.mention", () => {
  test("should match a valid mention with namespace and handle", () => {
    const mention = "@lens/johndoe";
    const result = mention.match(Regex.mention);
    expect(result).toEqual([mention]);
  });

  test("should match multiple valid mentions in a string", () => {
    const text = "Hello @lens/johndoe and @hey/janedoe!";
    const result = text.match(Regex.mention);
    expect(result).toEqual(["@lens/johndoe", "@hey/janedoe"]);
  });

  test("should match a valid mention at the start of a string", () => {
    const text = "@lens/johndoe is a user.";
    const result = text.match(Regex.mention);
    expect(result).toEqual(["@lens/johndoe"]);
  });

  test("should match a valid mention after a space", () => {
    const text = "Hi @lens/johndoe, how are you?";
    const result = text.match(Regex.mention);
    expect(result).toEqual(["@lens/johndoe"]);
  });

  test("should not match an invalid mention without a namespace", () => {
    const mention = "@johndoe";
    const result = mention.match(Regex.mention);
    expect(result).toBeNull();
  });

  test("should match a valid mention at the end of a sentence", () => {
    const text = "Thanks @lens/johndoe!";
    const result = text.match(Regex.mention);
    expect(result).toEqual(["@lens/johndoe"]);
  });

  test("should match mention after newline", () => {
    const text = "Hey there,\n@lens/johndoe is here!";
    const result = text.match(Regex.mention);
    expect(result).toEqual(["@lens/johndoe"]);
  });

  test("should not match a mention without a leading space", () => {
    const text = "Welcome@lens/johndoe!";
    const result = text.match(Regex.mention);
    expect(result).toBeNull();
  });
});
