import type { Request, Response } from "express";
import { describe, expect, test, vi } from "vitest";
import { get } from "../src/routes/health";

describe("GET /health", () => {
  test('should respond with json containing { ping: "pong" }', async () => {
    const req = {} as Request;
    const json = vi.fn();
    const res = { json } as unknown as Response;

    await get(req, res);

    expect(json).toHaveBeenCalledWith({ ping: "pong" });
  });
});
