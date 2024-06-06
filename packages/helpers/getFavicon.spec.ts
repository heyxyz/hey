import { describe, expect, test } from 'vitest';

import getFavicon from './getFavicon';

describe('getFavicon', () => {
  test('should return the correct favicon URL for a given URL', () => {
    const url = 'https://bcharity.net';
    const expectedFaviconUrl =
      'https://www.google.com/s2/favicons?domain=bcharity.net&sz=128';
    const result = getFavicon(url);

    expect(result).toBe(expectedFaviconUrl);
  });

  test('should handle URLs with "http://" prefix correctly', () => {
    const url = 'http://bcharity.net';
    const expectedFaviconUrl =
      'https://www.google.com/s2/favicons?domain=bcharity.net&sz=128';
    const result = getFavicon(url);

    expect(result).toBe(expectedFaviconUrl);
  });

  test('should handle URLs with "https://" prefix correctly', () => {
    const url = 'https://bcharity.net';
    const expectedFaviconUrl =
      'https://www.google.com/s2/favicons?domain=bcharity.net&sz=128';
    const result = getFavicon(url);

    expect(result).toBe(expectedFaviconUrl);
  });
});
