import { describe, expect, test } from 'vitest';

import {
  ARBITRUM_RPCS,
  ETHEREUM_RPCS,
  POLYGON_AMOY_RPCS,
  POLYGON_RPCS,
  ZORA_RPCS
} from '../rpcs';

describe('rpc liveliness', () => {
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

  for (const rpc of ETHEREUM_RPCS) {
    test(`should return 200 for ETHEREUM_RPCS - ${rpc}`, async () => {
      const response = await fetch(rpc);
      expect(response.status).toEqual(200);
    });
  }

  for (const rpc of ZORA_RPCS) {
    test(`should return 200 for ZORA_RPCS - ${rpc}`, async () => {
      const response = await fetch(rpc);
      expect(response.status).toEqual(200);
    });
  }

  for (const rpc of ARBITRUM_RPCS) {
    test(`should return 200 for ARBITRUM_RPCS - ${rpc}`, async () => {
      const response = await fetch(rpc);
      expect(response.status).toEqual(200);
    });
  }
});
