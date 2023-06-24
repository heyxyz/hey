import { describe, expect, test } from 'vitest';

import { TEST_URL } from '../constants';

describe('getImage', () => {
  test('should render image if url is provided', async () => {
    const getRequest = await fetch(
      `${TEST_URL}/image?hash=aHR0cHM6Ly9kaXNjb3JkLmNvbS9hc3NldHMvNjUyZjQwNDI3ZTFmNTE4NmFkNTQ4MzYwNzQ4OTgyNzkucG5n&transform=large`
    );
    const response: any = await getRequest.body;

    expect(response).toBeTruthy();
  });
});
