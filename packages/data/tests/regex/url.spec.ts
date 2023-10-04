import { describe, expect, test } from 'vitest';

import { Regex } from '../../regex';

const validate = (text: string) => {
  Regex.url.lastIndex = 0;
  return Regex.url.test(text);
};

describe('url regex', () => {
  test('should pass for more valid URLs', () => {
    expect(validate('http://example.com')).toBe(true);
    expect(validate('https://example.com')).toBe(true);
    expect(validate('ftp://example.com')).toBe(true);
    expect(validate('http://sub.example.com')).toBe(true);
    expect(validate('https://sub.example.com')).toBe(true);
    expect(validate('http://example.com/path/to/page')).toBe(true);
    expect(validate('https://example.com/path/to/page')).toBe(true);
    expect(validate('http://example.com/page?id=123')).toBe(true);
    expect(validate('https://example.com/page?id=123')).toBe(true);
    expect(validate('http://example.com/page#section')).toBe(true);
    expect(validate('https://example.com/page#section')).toBe(true);
    expect(validate('https://example.com/page?id=123&name=John')).toBe(true);
    expect(validate('https://example.com/page?id=123&name=John#section')).toBe(
      true
    );
  });

  test('should fail for more invalid URLs', () => {
    expect(validate('://example.com')).toBe(false);
    expect(validate('http://')).toBe(false);
    expect(validate('http:/example.com')).toBe(false);
    expect(validate('http://example')).toBe(false);
    expect(validate('http://.com')).toBe(false);
    expect(validate('http://example..com')).toBe(false);
    expect(validate('http://example.com/path with spaces')).toBe(false);
  });

  test('should pass for multiple URLs in the same string', () => {
    expect(
      validate(
        'Check out this website: https://www.example.com and also https://sub.example.com'
      )
    ).toBe(true);
  });
});
