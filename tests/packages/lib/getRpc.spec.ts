import getRpc, {
  ethereumRpcs,
  mumbaiRpcs,
  polygonRpcs
} from '@lenster/lib/getRpc';
import { expect, test } from '@playwright/test';

test.describe('getRpc', () => {
  test('should return a random Polygon RPC URL when chainId is 137', () => {
    const chainId = 137;
    const rpc = getRpc(chainId);
    expect(polygonRpcs).toContain(rpc);
  });

  test('should return a random Mumbai RPC URL when chainId is 80001', () => {
    const chainId = 80001;
    const rpc = getRpc(chainId);
    expect(mumbaiRpcs).toContain(rpc);
  });

  test('should return the default Ethereum RPC URL when chainId is not recognized', () => {
    const chainId = 1;
    const rpc = getRpc(chainId);
    expect(ethereumRpcs).toContain(rpc);
  });
});
