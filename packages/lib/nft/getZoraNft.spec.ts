import { describe, expect, test } from 'vitest';

import getZoraNFT from './getZoraNft';

describe('getZoraNft', () => {
  test('should return zora collection', () => {
    expect(
      getZoraNFT(
        'https://zora.co/collect/eth:0x2e1aa38556cd7eb7855a37f83101ee182c7af9b5'
      )
    ).contains({
      address: '0x2e1aa38556cd7eb7855a37f83101ee182c7af9b5',
      chain: 'eth'
    });
  });

  test('should return zora collection with token', () => {
    expect(
      getZoraNFT(
        'https://zora.co/collect/base:0x2e1aa38556cd7eb7855a37f83101ee182c7af9b5/1'
      )
    ).contains({
      address: '0x2e1aa38556cd7eb7855a37f83101ee182c7af9b5',
      chain: 'base',
      token: '1'
    });
  });

  test('should return zora collection with premint token', () => {
    expect(
      getZoraNFT(
        'https://zora.co/collect/zora:0x2e1aa38556cd7eb7855a37f83101ee182c7af9b5/premint-1'
      )
    ).contains({
      address: '0x2e1aa38556cd7eb7855a37f83101ee182c7af9b5',
      chain: 'zora',
      token: 'premint-1'
    });
  });
});
