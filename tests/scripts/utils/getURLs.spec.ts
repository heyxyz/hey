import { expect, test } from '@playwright/test';
import getURLs from 'utils/getURLs';

test.describe('getURLs', async () => {
  test('should return empty array when no URLs are found', async () => {
    const text = 'This text does not contain any URLs';
    await expect(getURLs(text)).toEqual([]);
  });

  test('should return array containing all URLs in the given text', async () => {
    const text = 'Here is an example text with a URL: https://example.com';
    const expectedUrls = ['https://example.com'];
    await expect(getURLs(text)).toEqual(expectedUrls);
  });

  test('should match both http and https protocols and www subdomains', async () => {
    const text = 'Here are some URLs: https://example.com http://www.example.net';
    const expectedUrls = ['https://example.com', 'http://www.example.net'];
    await expect(getURLs(text)).toEqual(expectedUrls);
  });

  test('should match multiple occurrences of URLs in the same text', async () => {
    const text = 'URL1: https://example.com URL2: http://www.example.net';
    const expectedUrls = ['https://example.com', 'http://www.example.net'];
    await expect(getURLs(text)).toEqual(expectedUrls);
  });
});
