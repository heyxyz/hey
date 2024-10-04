import type { Request, Response } from "express";
import { describe, expect, test, vi } from "vitest";
import { get } from "../src/routes/meta";

describe("GET /meta", () => {
  test("should respond with status 200 and correct meta information", async () => {
    const req = {} as Request;
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const res = { status } as unknown as Response;
    const next = vi.fn();

    // Mock environment variables
    process.env.RAILWAY_DEPLOYMENT_ID = "test-deployment";
    process.env.RAILWAY_REPLICA_ID = "test-replica";
    process.env.RAILWAY_SNAPSHOT_ID = "test-snapshot";

    await get[1](req, res, next);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      meta: {
        deployment: "test-deployment",
        replica: "test-replica",
        snapshot: "test-snapshot"
      },
      responseTimes: expect.objectContaining({
        clickhouse: expect.any(String),
        hey: expect.any(String),
        lens: expect.any(String),
        redis: expect.any(String)
      })
    });
  });
});
