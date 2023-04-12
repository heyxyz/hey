import { expect, test } from '@playwright/test';
import { METADATA_BASE_URL } from 'test/constants';

test('should return false if method is not POST', async ({ request }) => {
  const getMetadata = request.get(METADATA_BASE_URL);
  const response = await (await getMetadata).json();

  expect(response.success).toBeFalsy();
});

test('should return false if payload is not provided', async ({ request }) => {
  const postMetadata = request.post(METADATA_BASE_URL, {});
  const response = await (await postMetadata).json();

  expect(response.success).toBeFalsy();
});

test('should upload to arweave', async ({ request }) => {
  const postMetadata = request.post(METADATA_BASE_URL, {
    data: { ping: 'pong' }
  });
  const response = await (await postMetadata).json();

  expect(response.success).toBeTruthy();
});
