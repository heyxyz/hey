import { expect, test } from '@playwright/test';
import { METADATA_BASE_URL } from 'test/constants';

const expectedArweaveId = 'JulWV7TSj0BopTFhW0dvdo0ZtRdHFc6Rg-OjhcAWBsY';
const metatadata = { ping: 'pong' };

test('should upload to arweave', async ({ request }) => {
  const postMetadata = request.post(METADATA_BASE_URL, {
    data: metatadata
  });
  const response = await (await postMetadata).json();

  expect(response.success).toBeTruthy();
  expect(response.id).toBe(expectedArweaveId);
});

test('should have arweave metadata', async ({ request }) => {
  const arweaveData = request.get(`https://arweave.net/${expectedArweaveId}`);
  const response = await (await arweaveData).json();

  expect(metatadata.ping).toBe(response.ping);
});
