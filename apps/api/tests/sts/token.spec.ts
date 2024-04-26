import axios from 'axios';
import { TEST_URL } from 'src/helpers/constants';
import { describe, expect, test } from 'vitest';

describe('sts/token', () => {
  test('should return sts token', async () => {
    const response = await axios.get(`${TEST_URL}/sts/token`);

    expect(response.data).toHaveProperty('accessKeyId');
    expect(response.data).toHaveProperty('secretAccessKey');
    expect(response.data).toHaveProperty('sessionToken');
  });
});
