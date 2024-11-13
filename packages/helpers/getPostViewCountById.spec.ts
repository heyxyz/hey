import type { PostViewCount } from "@hey/types/hey";
import { describe, expect, test } from "vitest";
import getPostViewCountById from "./getPostViewCountById";

describe("getPostViewCountById", () => {
  test("should return the view count for a given id", () => {
    const views: PostViewCount[] = [
      { id: "1", views: 10 },
      { id: "2", views: 5 },
      { id: "3", views: 15 }
    ];
    const id = "2";
    const result = getPostViewCountById(views, id);

    expect(result).toEqual(5);
  });

  test("should return 0 if the id is not found", () => {
    const views: PostViewCount[] = [
      { id: "1", views: 10 },
      { id: "2", views: 5 },
      { id: "3", views: 15 }
    ];
    const id = "4";
    const result = getPostViewCountById(views, id);

    expect(result).toEqual(0);
  });

  test("should return 0 if views array is empty", () => {
    const views: PostViewCount[] = [];
    const id = "1";
    const result = getPostViewCountById(views, id);

    expect(result).toEqual(0);
  });

  test("should return 0 if id is an empty string", () => {
    const views: PostViewCount[] = [
      { id: "1", views: 10 },
      { id: "2", views: 5 }
    ];
    const id = "";
    const result = getPostViewCountById(views, id);

    expect(result).toEqual(0);
  });
});
