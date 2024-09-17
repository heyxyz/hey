import { describe, expect, test } from "vitest";

import { POLYGON_AMOY_RPCS, POLYGON_RPCS } from "../rpcs";

describe("rpc liveliness", () => {
  for (const rpc of POLYGON_RPCS) {
    test(`should return 200 for POLYGON_RPCS - ${rpc}`, async () => {
      const response = await fetch(rpc);
      expect(response.status).toEqual(200);
    });
  }

  for (const rpc of POLYGON_AMOY_RPCS) {
    test(`should return 200 for POLYGON_AMOY_RPCS - ${rpc}`, async () => {
      const response = await fetch(rpc);
      expect(response.status).toEqual(200);
    });
  }
});
