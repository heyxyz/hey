import { describe, expect, test } from 'vitest';

import collectModuleParams from './collectModuleParams';

describe('collectModuleParams', () => {
  const mockProfile: any = {
    ownedBy: { address: 'mockAddress' }
  };

  test('should return null when given an unsupported collect module type', () => {
    const unsupportedType = 'UnsupportedCollectModuleType';
    const collectModule: any = {
      amount: 100,
      collectLimit: 10,
      endsAt: '2022-01-01',
      followerOnly: true,
      referralFee: 5,
      type: unsupportedType
    };

    expect(collectModuleParams(collectModule, mockProfile)).toBeNull();
  });

  test('should return the correct params for CollectOpenActionModuleType.SimpleCollectOpenActionModule', () => {
    const collectModule: any = {
      amount: 100,
      collectLimit: 10,
      endsAt: '2022-01-01',
      followerOnly: true,
      referralFee: 5,
      type: 'SimpleCollectOpenActionModule'
    };

    const expectedParams = {
      simpleCollectOpenAction: {
        amount: 100,
        collectLimit: 10,
        endsAt: '2022-01-01',
        followerOnly: true,
        recipient: 'mockAddress',
        referralFee: 5
      }
    };

    expect(collectModuleParams(collectModule, mockProfile)).toEqual(
      expectedParams
    );
  });

  test('should return the correct params for CollectOpenActionModuleType.MultirecipientFeeCollectOpenActionModule', () => {
    const collectModule: any = {
      amount: {
        currency: 'USD',
        value: 100
      },
      collectLimit: 10,
      endsAt: '2022-01-01',
      followerOnly: true,
      recipients: [
        { address: 'address1', name: 'Recipient 1' },
        { address: 'address2', name: 'Recipient 2' }
      ],
      referralFee: 5,
      type: 'MultirecipientFeeCollectOpenActionModule'
    };

    const expectedParams = {
      multirecipientCollectOpenAction: {
        amount: {
          currency: 'USD',
          value: 100
        },
        collectLimit: 10,
        endsAt: '2022-01-01',
        followerOnly: true,
        recipients: [
          { address: 'address1', name: 'Recipient 1' },
          { address: 'address2', name: 'Recipient 2' }
        ],
        referralFee: 5
      }
    };

    expect(collectModuleParams(collectModule, mockProfile)).toEqual(
      expectedParams
    );
  });
});
