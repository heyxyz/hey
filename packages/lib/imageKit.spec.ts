import {
  LENS_MEDIA_SNAPSHOT_URL,
  STATIC_IMAGES_URL
} from '@lenster/data/constants';
import { describe, expect, test } from 'vitest';

import imageKit from './imageKit';

describe('imageKit', () => {
  test('should return empty string if url is not provided', () => {
    const result = imageKit('');
    expect(result).toEqual('');
  });

  test('should return the same url if it includes static-assets.lenster.xyz', () => {
    const url = `${STATIC_IMAGES_URL}/placeholder.webp`;
    const result = imageKit(url);
    expect(result).toEqual(url);
  });

  test('should return an empty string if url is null', () => {
    expect(imageKit(null as any)).toBe('');
  });

  test('should return the original url if it does not include LENS_MEDIA_SNAPSHOT_URL', () => {
    const url = 'https://example.com/image.jpg';
    expect(imageKit(url)).toBe(url);
  });

  test('should return the transformed url if it includes LENS_MEDIA_SNAPSHOT_URL', () => {
    const originalUrl = `${LENS_MEDIA_SNAPSHOT_URL}/some-image.jpg`;
    const transformedUrl = `${LENS_MEDIA_SNAPSHOT_URL}/transformed/some-image.jpg`;

    expect(imageKit(originalUrl, 'transformed')).toBe(transformedUrl);
  });

  test('should return the original url if name is not provided', () => {
    const originalUrl = 'https://lenster.com/some-image.jpg';

    expect(imageKit(originalUrl)).toBe(originalUrl);
  });
});
