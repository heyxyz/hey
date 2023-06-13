import truncateUrl from '@lenster/lib/truncateUrl';
import { expect, test } from '@playwright/test';

test.describe('truncateUrl', () => {
  test('should strip http(s) and www', () => {
    const url = 'https://www.example.com/foo';
    expect(truncateUrl(url, 30)).toEqual('example.com/foo');
  });

  test('truncate url that is longer than max length', () => {
    const url = 'https://example.com/path?key=value';
    expect(truncateUrl(url, 20)).toEqual('example.com/path?ke…');
  });

  test('do not truncate url that is exactly max length (after prefix stripped)', () => {
    const url = 'https://example.com/pathname';
    expect(truncateUrl(url, 20)).toEqual('example.com/pathname');
  });
});
