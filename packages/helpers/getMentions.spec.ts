import { describe, expect, test } from "vitest";
import getMentions from "./getMentions";

describe("getMentions", () => {
  test("should return an empty array for text without mentions", () => {
    const text = "This is a test message";
    const result = getMentions(text);
    expect(result).toEqual([]);
  });

  test("should return an empty array for an empty string", () => {
    const text = "";
    const result = getMentions(text);
    expect(result).toEqual([]);
  });

  test("should return an array with a single mention", () => {
    const text = "Hey @lens/johnsmith! How are you?";
    const result = getMentions(text);
    expect(result).toEqual([
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: "lens/johnsmith",
          localName: "johnsmith"
        },
        stillOwnsHandle: true
      }
    ]);
  });

  test("should return an array with multiple mentions", () => {
    const text = "Hello @lens/john, @hey/jane, and @tape/doe!";
    const result = getMentions(text);
    expect(result).toEqual([
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: "lens/john",
          localName: "john"
        },
        stillOwnsHandle: true
      },
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: "hey/jane",
          localName: "jane"
        },
        stillOwnsHandle: true
      },
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: "tape/doe",
          localName: "doe"
        },
        stillOwnsHandle: true
      }
    ]);
  });

  test("should handle mentions with special characters", () => {
    const text = "Hey @lens/john_doe!";
    const result = getMentions(text);
    expect(result).toEqual([
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: "lens/john_doe",
          localName: "john_doe"
        },
        stillOwnsHandle: true
      }
    ]);
  });

  test("should handle multiple mentions in the same sentence", () => {
    const text = "@lens/jane @hey/john_doe are you coming to the party?";
    const result = getMentions(text);
    expect(result).toEqual([
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: "lens/jane",
          localName: "jane"
        },
        stillOwnsHandle: true
      },
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: "hey/john_doe",
          localName: "john_doe"
        },
        stillOwnsHandle: true
      }
    ]);
  });

  test("should return an array with multiple mentions with mixed cases", () => {
    const text = "Hello @Lens/John, @Hey/Jane, and @Tape/Doe!";
    const result = getMentions(text);
    expect(result).toEqual([
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: "lens/john",
          localName: "john"
        },
        stillOwnsHandle: true
      },
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: "hey/jane",
          localName: "jane"
        },
        stillOwnsHandle: true
      },
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: "tape/doe",
          localName: "doe"
        },
        stillOwnsHandle: true
      }
    ]);
  });
});
