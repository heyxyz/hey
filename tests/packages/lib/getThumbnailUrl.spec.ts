import { expect, test } from '@playwright/test';
import { STATIC_IMAGES_URL } from 'data/constants';
import type { MetadataOutput } from 'lens';
import { PublicationMainFocus } from 'lens';
import getThumbnailUrl from 'lib/getThumbnailUrl';

test.describe('getThumbnailUrl', () => {
  const mockMetadata: MetadataOutput = {
    attributes: [],
    media: [],
    tags: [],
    mainContentFocus: PublicationMainFocus.Article,
    cover: {
      original: { url: 'https://example.com/cover.png' },
      onChain: { url: null }
    },
    image: 'https://example.com/image.png'
  };

  test('should return an placeholder if no metadata is provided', () => {
    const metadata = undefined;
    const result = getThumbnailUrl(metadata);
    const expectedUrl = `${STATIC_IMAGES_URL}/placeholder.webp`;
    expect(result).toEqual(expectedUrl);
  });

  test('should return the original cover URL if available', () => {
    const metadata = mockMetadata;
    const result = getThumbnailUrl(metadata);
    expect(result).toEqual('https://example.com/cover.png');
  });

  test('should return the image URL if no original cover URL is available', () => {
    const metadata = { ...mockMetadata, cover: undefined };
    const result = getThumbnailUrl(metadata);
    expect(result).toEqual('https://example.com/image.png');
  });

  test('should return the static placeholder URL if no cover or image URLs are available', () => {
    const metadata = { cover: undefined, image: undefined };
    const expectedUrl = `${STATIC_IMAGES_URL}/placeholder.webp`;
    const result = getThumbnailUrl(metadata as MetadataOutput);
    expect(result).toEqual(expectedUrl);
  });
});
