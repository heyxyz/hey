import { expect, test } from '@playwright/test';
import { METADATA_BASE_URL } from 'test/constants';

test('should return 405 if method is not POST', async ({ request }) => {
  const getMetadata = request.get(METADATA_BASE_URL);
  const status = await (await getMetadata).status();

  expect(status).toBe(405);
});

test('should return 400 if payload is not provided', async ({ request }) => {
  const postMetadata = request.post(METADATA_BASE_URL, {});
  const status = await (await postMetadata).status();

  expect(status).toBe(400);
});

test('should upload to arweave', async ({ request }) => {
  const postMetadata = request.post(METADATA_BASE_URL, {
    data: { ping: 'pong' }
  });
  const response = await (await postMetadata).json();

  expect(response.success).toBeTruthy();
});
