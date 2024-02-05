import { describe, expect, test } from 'vitest';

import getPublicationContentUrls from './getPublicationContentUrls';

describe('getPublicationContentUrls', () => {
  test('should return an empty array if the input string contains no URLs', () => {
    expect(getPublicationContentUrls('This string has no URLs.')).toEqual([]);
  });

  test('should extract a single URL from a string', () => {
    expect(
      getPublicationContentUrls(
        'Check out this website: https://www.example.com.'
      )
    ).toEqual(['https://www.example.com']);
  });

  test('should extract multiple URLs from a string', () => {
    expect(
      getPublicationContentUrls(
        'Visit https://www.example.com and http://www.test.com for more information.'
      )
    ).toEqual(['https://www.example.com', 'http://www.test.com']);
  });

  test('should handle strings with URLs and text mixed together', () => {
    expect(
      getPublicationContentUrls(
        'This https://www.example.com is a test http://www.test.com string.'
      )
    ).toEqual(['https://www.example.com', 'http://www.test.com']);
  });

  test('should return an empty array for a string with only whitespace', () => {
    expect(getPublicationContentUrls('   ')).toEqual([]);
  });

  test('should not extract partial or malformed URLs', () => {
    expect(
      getPublicationContentUrls(
        'Visit www.example.com and test.com for more info.'
      )
    ).toEqual([]);
  });

  test('should handle strings with special characters in URLs', () => {
    expect(
      getPublicationContentUrls(
        'Special URL: https://www.example.com/path?query=param#hash.'
      )
    ).toEqual(['https://www.example.com/path?query=param#hash']);
  });

  test('should remove duplicate URLs from the output', () => {
    const stringWithDuplicates =
      'Visit https://www.example.com, https://www.example.com and check out http://www.test.com.';
    expect(getPublicationContentUrls(stringWithDuplicates)).toEqual([
      'https://www.example.com',
      'http://www.test.com'
    ]);
  });
});
