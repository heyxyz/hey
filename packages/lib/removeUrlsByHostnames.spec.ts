import { describe, expect, test } from 'vitest';

import removeUrlsByHostnames from './removeUrlsByHostnames';

describe('removeUrlsByHostnames', () => {
  test('should remove URLs containing specified hostnames from content', () => {
    const content =
      'Collect my art at https://zora.co/collect/zora:0xeb0851f650150fec6b80ed894d95d152e7166a5b';
    const hostnames = new Set(['zora.co']);
    const expectedContent = 'Collect my art at';

    expect(removeUrlsByHostnames(content, hostnames)).toEqual(expectedContent);
  });

  test('should handle multiple hostnames in the regex pattern correctly', () => {
    const content =
      'Collect my art at Zora https://zora.co/collect/zora:0xeb0851f650150fec6b80ed894d95d152e7166a5b and basepaint https://basepaint.art/mint/44';
    const hostnames = new Set(['zora.co', 'basepaint.art']);
    const expectedContent = 'Collect my art at Zora and basepaint';

    expect(removeUrlsByHostnames(content, hostnames)).toEqual(expectedContent);
  });

  test('should return the same content if no URLs match the specified hostnames', () => {
    const content = 'This is a sample text without any URLs.';
    const hostnames = new Set(['example.com']);

    expect(removeUrlsByHostnames(content, hostnames)).toBe(content);
  });
});
