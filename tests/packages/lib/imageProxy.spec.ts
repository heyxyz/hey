import { expect, test } from '@playwright/test';
import { AVATAR, STATIC_ASSETS_URL } from 'data/constants';
import imageProxy from 'lib/imageProxy';

test.describe('imageProxy', () => {
  test('should return empty string if url is not provided', () => {
    const result = imageProxy('');
    expect(result).toEqual('');
  });

  test('should return the same url if it includes static-assets.lenster.xyz', () => {
    const url = `${STATIC_IMAGES_URL}/placeholder.webp`;
    const result = imageProxy(url);
    expect(result).toEqual(url);
  });

  test.skip('should return a url with just the image url when no name is provided', () => {
    const url = 'image.jpg';
    const result = imageProxy(url);
    // expect(result).toEqual(`${USER_CONTENT_URL}/${url}`);
  });

  test.skip('should return a url with the image url and name when name is provided', () => {
    const url = 'image.jpg';
    const result = imageProxy(url, AVATAR);
    // expect(result).toEqual(`${USER_CONTENT_URL}/${AVATAR}/${url}`);
  });
});
