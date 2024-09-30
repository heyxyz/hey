import { describe, expect, test } from "vitest";
import getIp from "./getIp";

describe("getIp", () => {
  test("should return IP from 'cf-connecting-ip' header", () => {
    const req = {
      headers: {
        "cf-connecting-ip": "203.0.113.1"
      },
      connection: {}
    };
    const result = getIp(req);
    expect(result).toBe("203.0.113.1");
  });

  test("should return IP from 'x-real-ip' header", () => {
    const req = {
      headers: {
        "x-real-ip": "203.0.113.2"
      },
      connection: {}
    };
    const result = getIp(req);
    expect(result).toBe("203.0.113.2");
  });

  test("should return first IP from 'x-forwarded-for' header", () => {
    const req = {
      headers: {
        "x-forwarded-for": "203.0.113.3, 198.51.100.1"
      },
      connection: {}
    };
    const result = getIp(req);
    expect(result).toBe("203.0.113.3");
  });

  test("should return IP from 'remoteAddress' if headers are missing", () => {
    const req = {
      headers: {},
      connection: {
        remoteAddress: "203.0.113.4"
      }
    };
    const result = getIp(req);
    expect(result).toBe("203.0.113.4");
  });

  test("should return trimmed IP from header with spaces", () => {
    const req = {
      headers: {
        "x-forwarded-for": " 203.0.113.5 , 198.51.100.2 "
      },
      connection: {}
    };
    const result = getIp(req);
    expect(result).toBe("203.0.113.5");
  });

  test("should return the correct IP even if there are multiple in 'cf-connecting-ip'", () => {
    const req = {
      headers: {
        "cf-connecting-ip": "203.0.113.6, 198.51.100.3"
      },
      connection: {}
    };
    const result = getIp(req);
    expect(result).toBe("203.0.113.6");
  });
});
