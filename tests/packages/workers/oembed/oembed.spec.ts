import { expect, test } from '@playwright/test';
import { OEMBED_BASE_URL } from 'test/constants';

test('should return false if payload is not provided', async ({ request }) => {
  const getOembed = request.get(OEMBED_BASE_URL, {});
  const response = await (await getOembed).json();

  expect(response.success).toBeFalsy();
});

test('should return valid oembed response if url is provided', async ({
  request
}) => {
  const url = 'https://github.com/lensterxyz/lenster';
  const getOembed = request.get(OEMBED_BASE_URL, { params: { url } });
  const response = await (await getOembed).json();

  expect(response.success).toBeTruthy();
  expect(response.oembed.url).toBe(url);
  expect(response.oembed.title).toContain('GitHub - lensterxyz/lenster');
  expect(response.oembed.description).toContain(
    'Lenster is a decentralized and permissionless social media app'
  );
  expect(response.oembed.image).toContain('transform=large');
  expect(response.oembed.site).toBe('GitHub');
  expect(response.oembed.isLarge).toBeTruthy();
  expect(response.oembed.html).toBeNull();
});

test('should return valid oembed response if url supports iframe is provided', async ({
  request
}) => {
  const url = 'https://www.youtube.com/watch?v=H5v3kku4y6Q';
  const getOembed = request.get(OEMBED_BASE_URL, { params: { url } });
  const response = await (await getOembed).json();

  expect(response.success).toBeTruthy();
  expect(response.oembed.html).toContain(
    'https://www.youtube.com/embed/H5v3kku4y6Q'
  );
});
