import { AVATAR, STATIC_IMAGES_URL } from '@lenster/data/constants';
import imageKit from '@lenster/lib/imageKit';
import { expect, test } from '@playwright/test';

test.describe('imageKit', () => {
  test('should return empty string if url is not provided', () => {
    const result = imageKit('');
    expect(result).toEqual('');
  });

  test('should return the same url if it includes static-assets.lenster.xyz', () => {
    const url = `${STATIC_IMAGES_URL}/placeholder.webp`;
    const result = imageKit(url);
    expect(result).toEqual(url);
  });

  test.skip('should return a url with just the image url when no name is provided', () => {
    const url = 'image.jpg';
    const result = imageKit(url);
    // expect(result).toEqual(`${USER_CONTENT_URL}/${url}`);
  });

  test.skip('should return a url with the image url and name when name is provided', () => {
    const url = 'image.jpg';
    const result = imageKit(url, AVATAR);
    // expect(result).toEqual(`${USER_CONTENT_URL}/${AVATAR}/${url}`);
  });
});
