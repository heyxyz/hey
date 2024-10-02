import { describe, expect, test } from "vitest";
import findEventKeyDeep from "./findEventKeyDeep";

describe("findEventKeyDeep", () => {
  test("should return the key when the target is present at the first level", () => {
    const obj = { eventA: "start", eventB: "middle", eventC: "end" };
    const target = "middle";
    const result = findEventKeyDeep(obj, target);
    expect(result).toBe("eventB");
  });

  test("should return the key when the target is present at a nested level", () => {
    const obj = {
      level1: { level2: { eventA: "start", eventB: "middle" }, eventC: "end" },
      eventD: "another"
    };
    const target = "middle";
    const result = findEventKeyDeep(obj, target);
    expect(result).toBe("eventB");
  });

  test("should return the first key found when multiple keys have the same target value", () => {
    const obj = {
      eventA: "duplicate",
      level1: { eventB: "duplicate", level2: { eventC: "duplicate" } },
      eventD: "unique"
    };
    const target = "duplicate";
    const result = findEventKeyDeep(obj, target);
    expect(result).toBe("eventA");
  });

  test("should return null when the target is not present in the object", () => {
    const obj = { eventA: "start", eventB: "middle", eventC: "end" };
    const target = "notFound";
    const result = findEventKeyDeep(obj, target);
    expect(result).toBeNull();
  });

  test("should return null when the object is empty", () => {
    const obj = {};
    const target = "anyValue";
    const result = findEventKeyDeep(obj, target);
    expect(result).toBeNull();
  });

  test("should return the key when the target is present in an array within the object", () => {
    const obj = { events: ["start", "middle", "end"], eventA: "another" };
    const target = "middle";
    const result = findEventKeyDeep(obj, target);
    expect(result).toBe("1");
  });

  test("should handle objects with mixed data types", () => {
    const obj = {
      eventA: "start",
      eventB: 123,
      eventC: null,
      eventD: { eventE: "middle", eventF: true }
    };
    const target = "middle";
    const result = findEventKeyDeep(obj, target);
    expect(result).toBe("eventE");
  });

  test("should handle deeply nested objects", () => {
    const obj = {
      level1: { level2: { level3: { level4: { eventA: "deepValue" } } } },
      eventB: "shallow"
    };
    const target = "deepValue";
    const result = findEventKeyDeep(obj, target);
    expect(result).toBe("eventA");
  });

  test("should return null if the object contains circular references", () => {
    const obj: any = { eventA: "start" };
    obj.level1 = obj;
    const target = "start";
    const result = findEventKeyDeep(obj, target);
    expect(result).toBe("eventA");
  });
});
