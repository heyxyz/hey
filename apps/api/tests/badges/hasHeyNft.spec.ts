import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('badges/hasHeyNft', () => {
  test.skip('should return true if address has Hey NFT', async () => {
    const response = await axios.get(`${TEST_URL}/badges/hasHeyNft`, {
      params: { address: '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF' }
    });

    expect(response.data.hasHeyNft).toBeTruthy();
  });

  test('should return false if address does not have Hey NFT', async () => {
    const response = await axios.get(`${TEST_URL}/badges/hasHeyNft`, {
      params: { address: '0x9AF37db37E74A0Fd6c12cDc84cC4C870d0bd41b9' }
    });

    expect(response.data.hasHeyNft).toBeFalsy();
  });
});
