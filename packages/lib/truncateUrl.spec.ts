import { describe, expect, test } from 'vitest';

import truncateUrl from './truncateUrl';

describe('truncateUrl', () => {
  test('should strip http(s) and www', () => {
    const url = 'https://www.example.com/foo';
    expect(truncateUrl(url, 30)).toEqual('example.com/foo');
  });

  test('should truncate url that is longer than max length', () => {
    const url = 'https://example.com/path?key=value';
    expect(truncateUrl(url, 20)).toEqual('example.com/path?ke…');
  });

  test('should not truncate url that is max length or shorter (after prefix stripped)', () => {
    const maxLengthUrl = 'https://example.com/pathname';
    const shortUrl = 'https://example.com/foo';
    expect(truncateUrl(maxLengthUrl, 20)).toEqual('example.com/pathname');
    expect(truncateUrl(shortUrl, 20)).toEqual('example.com/foo');
  });

  test('should not truncate *.hey.xyz urls', () => {
    const mainnetUrl = 'https://hey.xyz/long/pathname/test';
    const testnetUrl = 'https://testnet.hey.xyz/long/pathname/test';
    expect(truncateUrl(mainnetUrl, 20)).toEqual('hey.xyz/long/pathname/test');
    expect(truncateUrl(testnetUrl, 20)).toEqual(
      'testnet.hey.xyz/long/pathname/test'
    );
  });
});
