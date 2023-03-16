import { expect, test } from '@playwright/test';
import { AVATAR, USER_CONTENT_URL } from 'data/constants';
import imageProxy from 'utils/imageProxy';

test.describe('imageProxy', async () => {
  test('should return a url with just the image url when no name is provided', async () => {
    const url = 'image.jpg';
    const result = imageProxy(url);
    await expect(result).toEqual(`${USER_CONTENT_URL}/${url}`);
  });

  test('should return a url with the image url and name when name is provided', async () => {
    const url = 'image.jpg';
    const result = imageProxy(url, AVATAR);
    await expect(result).toEqual(`${USER_CONTENT_URL}/${AVATAR}/${url}`);
  });
});
