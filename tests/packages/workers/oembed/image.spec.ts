import { expect, test } from '@playwright/test';
import { OEMBED_BASE_URL } from 'test/constants';

test('should render image if url is provided', async ({ request }) => {
  const getImage = request.get(`${OEMBED_BASE_URL}/image`, {
    params: {
      hash: 'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hc3NldHMvNjUyZjQwNDI3ZTFmNTE4NmFkNTQ4MzYwNzQ4OTgyNzkucG5n',
      transform: 'large'
    }
  });

  const response = await (await getImage).body();
  expect(response).toBeTruthy();
});
