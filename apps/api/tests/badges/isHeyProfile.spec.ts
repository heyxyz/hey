import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('badges/isHeyProfile', () => {
  test('should return true if profile (address) is created via Hey', async () => {
    const response = await axios.get(`${TEST_URL}/badges/isHeyProfile`, {
      params: { address: '0x0Cfc642C90ED27be228E504307049230545b2981' }
    });

    expect(response.data.isHeyProfile).toBeTruthy();
  });

  test('should return false if profile (address) is not created via Hey', async () => {
    const response = await axios.get(`${TEST_URL}/badges/isHeyProfile`, {
      params: { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' }
    });

    expect(response.data.isHeyProfile).toBeFalsy();
  });

  test('should return true if profile (id) is created via Hey', async () => {
    const response = await axios.get(`${TEST_URL}/badges/isHeyProfile`, {
      params: { id: '0x0415da' }
    });

    expect(response.data.isHeyProfile).toBeTruthy();
  });

  test('should return false if profile (id) is not created via Hey', async () => {
    const response = await axios.get(`${TEST_URL}/badges/isHeyProfile`, {
      params: { id: '0x0d' }
    });

    expect(response.data.isHeyProfile).toBeFalsy();
  });
});
