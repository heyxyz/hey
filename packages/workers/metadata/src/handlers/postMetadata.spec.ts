import { describe, expect, test } from 'vitest';

import { TEST_URL } from '../constants';

describe('postMetadata', () => {
  test('should return welcome message', async () => {
    const getRequest = await fetch(TEST_URL);
    const response = await getRequest.text();

    expect(response).toContain('gm, to metadata service 👋');
  });

  test('should return resolved address', async () => {
    const postRequest = await fetch(TEST_URL, {
      method: 'POST',
      body: JSON.stringify({
        content: 'gm, running test from lenster codebase'
      })
    });
    const response: any = await postRequest.json();

    expect(response.success).toBeTruthy();
    expect(response.metadata).toEqual({
      content: 'gm, running test from lenster codebase',
      tags: ['science_&_technology'],
      locale: 'en'
    });
  });
});
