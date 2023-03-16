import { expect, test } from '@playwright/test';
import getURLs from 'utils/getURLs';

test.describe('getURLs', () => {
  test('should return empty array when no URLs are found', () => {
    const text = 'This text does not contain any URLs';
    expect(getURLs(text)).toEqual([]);
  });

  test('should return array containing all URLs in the given text', () => {
    const text = 'Here is an example text with a URL: https://example.com';
    const expectedUrls = ['https://example.com'];
    expect(getURLs(text)).toEqual(expectedUrls);
  });

  test('should match both http and https protocols and www subdomains', () => {
    const text = 'Here are some URLs: https://example.com http://www.example.net';
    const expectedUrls = ['https://example.com', 'http://www.example.net'];
    expect(getURLs(text)).toEqual(expectedUrls);
  });

  test('should match multiple occurrences of URLs in the same text', () => {
    const text = 'URL1: https://example.com URL2: http://www.example.net';
    const expectedUrls = ['https://example.com', 'http://www.example.net'];
    expect(getURLs(text)).toEqual(expectedUrls);
  });
});
