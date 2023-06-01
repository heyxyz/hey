import getSnapshotProposalId from '@lenster/lib/getSnapshotProposalId';
import { expect, test } from '@playwright/test';

test.describe('getSnapshotProposalId', () => {
  test('should return null when host is not snapshot.org', () => {
    expect(getSnapshotProposalId(['https://google.com'])).toBeNull();
  });

  test('should return null for invalid urls', () => {
    expect(getSnapshotProposalId(['https://snapshot.org'])).toBeNull();
    expect(
      getSnapshotProposalId(['https://snapshot.org/#/invalid-url'])
    ).toBeNull();
    expect(
      getSnapshotProposalId([
        'https://snapshot.org/#/123.eth/proposal/invalid-id'
      ])
    ).toBeNull();
  });

  test('should return the proposal id for valid urls', () => {
    expect(
      getSnapshotProposalId([
        'https://snapshot.org/#/123.eth/proposal/0x1234567890123456789012345678901234567890123456789012345678901234'
      ])
    ).toEqual(
      '0x1234567890123456789012345678901234567890123456789012345678901234'
    );
    expect(
      getSnapshotProposalId([
        'https://snapshot.org/#/abc123.eth/proposal/0xabcdefABCDEFabcdefABCDEFabcdefABCDEFABCDEFabcdefABCDEFABCDEFabcd'
      ])
    ).toEqual(
      '0xabcdefABCDEFabcdefABCDEFabcdefABCDEFABCDEFabcdefABCDEFABCDEFabcd'
    );
  });

  test('should return the proposal id for one valid url and one invalid url', () => {
    expect(
      getSnapshotProposalId([
        'https://google.com',
        'https://snapshot.org/#/123.eth/proposal/0x1234567890123456789012345678901234567890123456789012345678901234'
      ])
    ).toEqual(
      '0x1234567890123456789012345678901234567890123456789012345678901234'
    );
  });

  test('should return the proposal id for two valid urls', () => {
    expect(
      getSnapshotProposalId([
        'https://snapshot.org/#/123.eth/proposal/0xf925c956cdb2a8797fde0f6bdc598727a2944be742621a5230cc15d25d8f3f91',
        'https://snapshot.org/#/123.eth/proposal/0x1234567890123456789012345678901234567890123456789012345678901234'
      ])
    ).toEqual(
      '0xf925c956cdb2a8797fde0f6bdc598727a2944be742621a5230cc15d25d8f3f91'
    );
  });
});
