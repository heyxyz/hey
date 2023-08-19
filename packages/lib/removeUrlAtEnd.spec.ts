import { describe, expect, test } from 'vitest';

import removeUrlAtEnd from './removeUrlAtEnd';

describe('removeUrlAtEnd', () => {
  test('should format content with single link at end', () => {
    const urls = ['https://lens.com'];
    const content = 'Random text here' + urls[0];
    const result = removeUrlAtEnd(urls, content);
    expect(result).toEqual('Random text here');
  });

  test('should not format content with more than one link', () => {
    const urls = ['https://lens.com', 'https://lens.co'];
    const content = 'Random text here' + urls[0] + urls[1];
    const result = removeUrlAtEnd(urls, content);
    expect(result).toEqual(content);
  });

  test('should not format content with link not at the end', () => {
    const urls = ['https://lens.com'];
    const content = 'Random text' + urls[0] + 'here';
    const result = removeUrlAtEnd(urls, content);
    expect(result).toEqual(content);
  });
});
