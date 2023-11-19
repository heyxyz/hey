import { TEST_ENDPOINT } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('sts/token', () => {
  test('should return token', async () => {
    const { data } = await axios.get(`${TEST_ENDPOINT}/sts/token`);
    expect(data.success).toBeTruthy();
    expect(data.sessionToken).contains('eyJh');
  });
});
