import { describe, expect, test } from 'vitest';

import getNft from './getNft';

describe('getNft', () => {
  test('should return null if the list of URLs is empty', () => {
    const urls: string[] = [];
    expect(getNft(urls)).toBeNull();
  });

  test('should return nft metadata if there are known URLs', () => {
    const urls: string[] = [
      'https://zora.co/collect/eth:0x2e1aa38556cd7eb7855a37f83101ee182c7af9b5/3'
    ];
    expect(getNft(urls)).toContain({
      chain: 'eth',
      address: '0x2e1aa38556cd7eb7855a37f83101ee182c7af9b5',
      token: '3'
    });
  });

  test('should return nft metadata if there are known URLs without token', () => {
    const urls: string[] = [
      'https://zora.co/collect/eth:0x2e1aa38556cd7eb7855a37f83101ee182c7af9b5'
    ];
    expect(getNft(urls)).toContain({
      chain: 'eth',
      address: '0x2e1aa38556cd7eb7855a37f83101ee182c7af9b5'
    });
  });

  test('should return null if there are no known URLs', () => {
    const urls: string[] = ['https://example.com'];
    expect(getNft(urls)).toBeNull();
  });

  test('should return null if the known URLs do not have hostname "zora.co"', () => {
    const urls: string[] = ['https://example.com', 'https://unknown.com'];
    expect(getNft(urls)).toBeNull();
  });
});
