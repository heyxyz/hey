import { describe, expect, test } from 'vitest';

import collectModuleParams from './collectModuleParams';

describe('collectModuleParams', () => {
  const mockProfile: any = {
    ownedBy: { address: 'mockAddress' }
  };

  test('should return null when given an unsupported collect module type', () => {
    const unsupportedType = 'UnsupportedCollectModuleType';
    const collectModule: any = {
      type: unsupportedType,
      collectLimit: 10,
      followerOnly: true,
      endsAt: '2022-01-01',
      amount: 100,
      referralFee: 5
    };

    expect(collectModuleParams(collectModule, mockProfile)).toBeNull();
  });

  test('should return the correct params for CollectOpenActionModuleType.SimpleCollectOpenActionModule', () => {
    const collectModule: any = {
      type: 'SimpleCollectOpenActionModule',
      collectLimit: 10,
      followerOnly: true,
      endsAt: '2022-01-01',
      amount: 100,
      referralFee: 5
    };

    const expectedParams = {
      simpleCollectOpenAction: {
        collectLimit: 10,
        followerOnly: true,
        endsAt: '2022-01-01',
        amount: 100,
        referralFee: 5,
        recipient: 'mockAddress'
      }
    };

    expect(collectModuleParams(collectModule, mockProfile)).toEqual(
      expectedParams
    );
  });

  test('should return the correct params for CollectOpenActionModuleType.MultirecipientFeeCollectOpenActionModule', () => {
    const collectModule: any = {
      type: 'MultirecipientFeeCollectOpenActionModule',
      collectLimit: 10,
      followerOnly: true,
      endsAt: '2022-01-01',
      amount: {
        value: 100,
        currency: 'USD'
      },
      referralFee: 5,
      recipients: [
        { name: 'Recipient 1', address: 'address1' },
        { name: 'Recipient 2', address: 'address2' }
      ]
    };

    const expectedParams = {
      multirecipientCollectOpenAction: {
        collectLimit: 10,
        followerOnly: true,
        endsAt: '2022-01-01',
        amount: {
          value: 100,
          currency: 'USD'
        },
        referralFee: 5,
        recipients: [
          { name: 'Recipient 1', address: 'address1' },
          { name: 'Recipient 2', address: 'address2' }
        ]
      }
    };

    expect(collectModuleParams(collectModule, mockProfile)).toEqual(
      expectedParams
    );
  });
});
