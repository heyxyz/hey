import generateSnapshotAccount from '@lenster/lib/generateSnapshotAccount';
import { expect, test } from '@playwright/test';

test.describe('generateSnapshotAccount', () => {
  global.crypto = require('crypto');

  test('should return empty string when handle is null', async () => {
    const input = {
      ownedBy: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
      profileId: '0x15',
      proposalId:
        '0xf463e18ec96c45c61d1e846bdd63246ac5660f7932d4c6fe7d132bd83bfea18f'
    };

    const result = await generateSnapshotAccount(input);

    expect(result.address).toBe('0xdF25AE34dd212edd99e58584f0a0AD7aA6EeabD8');
    expect(result.privateKey).toBe(
      '734a7b7441d9179445dd4a4fd1035e11e16c2b947b4b4a7458444899c138f6d8'
    );
  });
});
